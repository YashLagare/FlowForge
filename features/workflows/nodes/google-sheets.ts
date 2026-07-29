import { GoogleAuth } from "google-auth-library"
import { getConnection } from "@/features/connections/data"
import { decrypt } from "@/lib/encryption"

export async function googleSheets({
  orgId,
  connectionId,
  operation,
  spreadsheetId,
  sheetName,
  mappedValues,
}: {
  orgId: string
  connectionId: string
  operation: string
  spreadsheetId: string
  sheetName: string
  mappedValues: string
}) {
  if (!connectionId) throw new Error("No connection selected")
  
  const connection = await getConnection(orgId, connectionId)
  if (!connection) throw new Error("Google Sheets connection not found")

  const credentialsStr = decrypt(connection.encryptedData)
  let credentials
  try {
    credentials = JSON.parse(credentialsStr)
  } catch (e) {
    throw new Error("Invalid connection credentials format")
  }

  if (!spreadsheetId) throw new Error("Spreadsheet ID is required")
  if (!sheetName) throw new Error("Sheet Name is required")

  // The mappedValues come in as a JSON string: [{"key": "Company", "value": "Google"}]
  let pairs: { key: string; value: string }[] = []
  try {
    if (mappedValues) {
      pairs = JSON.parse(mappedValues)
    }
  } catch (e) {
    throw new Error("Failed to parse mapped values")
  }

  if (pairs.length === 0) {
    throw new Error("At least one column mapping must be provided")
  }

  // Duplicate key check
  const keys = new Set()
  for (const p of pairs) {
    if (keys.has(p.key)) throw new Error(`Duplicate column mapping found for: ${p.key}`)
    keys.add(p.key)
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  if (operation === "append-row") {
    // 1. Fetch headers to map our key-value pairs to the correct column indices
    let headers: string[] = []
    try {
      const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!1:1`
      const headerRes = await auth.request<any>({ url: headerUrl, method: "GET" })
      if (headerRes.data.values && headerRes.data.values.length > 0) {
        headers = headerRes.data.values[0]
      } else {
        throw new Error("Sheet is empty or missing headers. Please add header columns in row 1.")
      }
    } catch (e: any) {
      throw new Error("Failed to read sheet headers: " + (e.message || "Unknown error"))
    }

    // 2. Build the array based on header indices
    const rowData: string[] = new Array(headers.length).fill("")
    for (const pair of pairs) {
      const idx = headers.findIndex((h) => h.trim().toLowerCase() === pair.key.trim().toLowerCase())
      if (idx !== -1) {
        rowData[idx] = pair.value
      } else {
        throw new Error(`Column "${pair.key}" not found in sheet headers.`)
      }
    }

    // 3. Append the row
    try {
      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED`
      const response = await auth.request<any>({
        url: appendUrl,
        method: "POST",
        data: {
          values: [rowData],
        },
      })
      return { success: true, updatedRange: response.data.updates?.updatedRange }
    } catch (e: any) {
      throw new Error("Failed to append row: " + (e.message || "Unknown error"))
    }
  } else {
    throw new Error(`Unsupported operation: ${operation}`)
  }
}
