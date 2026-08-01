export function ifElse({
  leftValue = "",
  operator = "equals",
  rightValue = "",
}: {
  leftValue?: string
  operator?: string
  rightValue?: string
}) {
  const left = leftValue.trim()
  const right = rightValue.trim()
  let result = false

  // Helper for numeric comparison parsing
  const getNumeric = (): { numL: number; numR: number; isValid: boolean } => {
    const numL = parseFloat(left)
    const numR = parseFloat(right)
    return { numL, numR, isValid: !isNaN(numL) && !isNaN(numR) }
  }

  switch (operator) {
    case "equals":
      result = left === right
      break
    case "not_equals":
      result = left !== right
      break
    case "contains":
      result = left.toLowerCase().includes(right.toLowerCase())
      break
    case "not_contains":
      result = !left.toLowerCase().includes(right.toLowerCase())
      break
    case "starts_with":
      result = left.toLowerCase().startsWith(right.toLowerCase())
      break
    case "ends_with":
      result = left.toLowerCase().endsWith(right.toLowerCase())
      break
    case "greater_than": {
      const { numL, numR, isValid } = getNumeric()
      result = isValid ? numL > numR : left > right
      break
    }
    case "greater_than_or_equal": {
      const { numL, numR, isValid } = getNumeric()
      result = isValid ? numL >= numR : left >= right
      break
    }
    case "less_than": {
      const { numL, numR, isValid } = getNumeric()
      result = isValid ? numL < numR : left < right
      break
    }
    case "less_than_or_equal": {
      const { numL, numR, isValid } = getNumeric()
      result = isValid ? numL <= numR : left <= right
      break
    }
    case "is_empty":
      result = left.length === 0
      break
    case "is_not_empty":
      result = left.length > 0
      break
    case "regex": {
      try {
        const re = new RegExp(right, "i")
        result = re.test(left)
      } catch (err) {
        throw new Error(`Invalid regular expression pattern: "${right}".`)
      }
      break
    }
    default:
      result = false
  }

  const branch = result ? "true" : "false"
  const details = `Expression "${left}" ${operator} "${right}" -> ${result ? "TRUE" : "FALSE"} (Following IF ${branch.toUpperCase()} branch)`

  return {
    result,
    branch,
    details,
  }
}
