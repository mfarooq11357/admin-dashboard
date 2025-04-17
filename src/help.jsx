"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import Loader from "./components/Loader"

const faqs = [
  {
    id: "faq-1",
    number: "01",
    question: "What is Society Management System?",
    answer:
      "The Society Management System is a comprehensive platform designed to streamline the management of societies, clubs, and organizations. It provides tools for membership management, event planning, financial tracking, and communication between members and administrators.",
  },
  {
    id: "faq-2",
    number: "02",
    question: "How can members use this system?",
    answer:
      "Members can use this system to register for events, pay dues, communicate with other members, access important documents, view announcements, and participate in society activities. The user-friendly interface makes it easy to navigate and utilize all available features.",
  },
  {
    id: "faq-3",
    number: "03",
    question: "Who can access the admin dashboard?",
    answer:
      "Only authorized individuals, such as society committee members or property managers, can access the admin dashboard to manage society operations.",
  },
  {
    id: "faq-4",
    number: "04",
    question: "Is my personal data secure in this system?",
    answer:
      "Yes, your personal data is secure. We implement industry-standard encryption protocols, regular security audits, and strict access controls. All data is stored in compliance with relevant data protection regulations, and we never share your information with third parties without your explicit consent.",
  },
]

function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg text-gray-700">
            Facing issues? Get in touch at{" "}
            <a href="mailto:example@uog.edu.pk" className="text-blue-600 hover:underline">
              mfarooq11357@gmail.com
            </a>
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-4xl font-bold text-center mb-3">Frequently Asked Questions</h3>
          <p className="text-center text-lg text-gray-700">
            Everything you need to know about using our platform, all in one place.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                aria-expanded={openFAQ === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <div className="flex items-center">
                  <span className="text-4xl font-bold mr-6">{faq.number}</span>
                  <h4 className="text-xl font-semibold">{faq.question}</h4>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openFAQ === faq.id ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === faq.id ? "max-h-96" : "max-h-0"
                }`}
              >
                {openFAQ === faq.id && (
                  <div className="relative text-white p-6 pt-12 pb-12">
                    {/* Mobile background */}
                    <div className="absolute inset-0 bg-blue-600 md:hidden z-0" />
                    
                    {/* Original desktop image (unchanged) */}
                    <div className="absolute inset-0 z-0 hidden md:block">
                      <div className="absolute inset-0">
                        <img
                          src="https://i.ibb.co/P0KqJPD/111111111111.jpg"
                          alt=""
                          className="absolute inset-0 w-full h-18 object-cover pb-8"
                          style={{ backgroundSize: "100% 100%" }}
                        />
                      </div>
                    </div>
                    
                    {/* Answer text with mobile adjustments */}
                    <p className="relative z-10 text-lg md:px-0 px-4 lg:pt-16">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default FAQSection