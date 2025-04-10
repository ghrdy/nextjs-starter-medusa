"use client"

import { useState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import TextArea from "@modules/common/components/textarea"

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Ici, vous pouvez remplacer par votre propre logique d'envoi d'email
      // Exemple : await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formState) })

      // Simulation d'un envoi d'email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitError(
        "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-white px-8 py-4 rounded-lg shadow-sm border border-ui-border-base">
      <h2 className="text-2xl-semi mb-6">Contactez-nous</h2>
      <p className="text-base-regular mb-8">
        Vous avez des questions, des suggestions ou des commentaires ? N'hésitez
        pas à nous contacter en remplissant le formulaire ci-dessous.
      </p>

      {submitSuccess ? (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800">
            Votre message a été envoyé avec succès. Nous vous répondrons dans
            les plus brefs délais.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              value={formState.phone}
              onChange={handleInputChange}
            />
            <Input
              label="Sujet"
              name="subject"
              value={formState.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <TextArea
            label="Message"
            name="message"
            value={formState.message}
            onChange={handleInputChange}
            rows={5}
            required
          />

          {submitError && (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-800">{submitError}</p>
            </div>
          )}

          <div className="mt-4">
            <SubmitButton disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  )
}

export default ContactForm
