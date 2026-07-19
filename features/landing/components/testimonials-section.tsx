"use client"

import React from "react"
import { motion } from "motion/react"

type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

const TESTIMONIAL_COLUMNS = [
  [
    {
      text: "FlowForge completely changed how our team operates. The visual builder is incredibly intuitive.",
      image: "https://i.pravatar.cc/150?u=1",
      name: "Sarah Jenkins",
      role: "CTO, TechStart",
    },
    {
      text: "The AI agent node is magical. It processes our unstructured data flawlessly in seconds.",
      image: "https://i.pravatar.cc/150?u=2",
      name: "Michael Chen",
      role: "Product Manager",
    },
    {
      text: "Real-time collaboration means my team can build workflows together without stepping on each other's toes.",
      image: "https://i.pravatar.cc/150?u=3",
      name: "Emily Rodriguez",
      role: "Operations Lead",
    },
  ],
  [
    {
      text: "We migrated our entire backend logic to FlowForge in a weekend. Unbelievably fast.",
      image: "https://i.pravatar.cc/150?u=4",
      name: "David Kim",
      role: "Lead Engineer",
    },
    {
      text: "The execution replays saved us countless hours of debugging. We can see exactly where data flows.",
      image: "https://i.pravatar.cc/150?u=5",
      name: "Alex Thompson",
      role: "Systems Architect",
    },
    {
      text: "A game-changer for B2B SaaS. We can deploy new logic instantly without redeploying our app.",
      image: "https://i.pravatar.cc/150?u=6",
      name: "Jessica Patel",
      role: "Founder",
    },
  ],
  [
    {
      text: "The organization-level billing and RBAC makes this perfect for our enterprise clients.",
      image: "https://i.pravatar.cc/150?u=7",
      name: "Robert Fox",
      role: "VP of Engineering",
    },
    {
      text: "I haven't written a line of integration code since we started using this platform.",
      image: "https://i.pravatar.cc/150?u=8",
      name: "Amanda Lee",
      role: "Developer",
    },
    {
      text: "Simple, powerful, and scales infinitely. What more could you ask for?",
      image: "https://i.pravatar.cc/150?u=9",
      name: "Chris Evans",
      role: "Tech Lead",
    },
  ],
]

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="w-full max-w-xs rounded-3xl border border-border bg-card p-10 text-card-foreground shadow-lg shadow-primary/10"
                  key={i}
                >
                  <div>"{text}"</div>
                  <div className="mt-5 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="leading-5 font-medium tracking-tight">{name}</div>
                      <div className="leading-5 tracking-tight opacity-60">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}

export function TestimonialsSection() {
  const [firstColumn, secondColumn, thirdColumn] = TESTIMONIAL_COLUMNS

  return (
    <section id="how-it-works" className="bg-background py-24 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="border border-primary/20 bg-primary/5 py-1 px-4 text-sm font-medium rounded-full text-primary">Testimonials</div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Loved by engineering teams
          </h2>
          <p className="text-lg text-muted-foreground">
            See how modern organizations use FlowForge to accelerate their development.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={35} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={45}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={39}
          />
        </div>
      </div>
    </section>
  )
}
