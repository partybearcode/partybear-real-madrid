import { MadridistaChatbot } from '../components/chatbot/MadridistaChatbot'
import { PageHero } from '../components/common/PageHero'

export function ChatbotPage() {
  return (
    <>
      <PageHero
        eyebrow="Chat Madridista"
        title="Asistente IA de linea blanca"
        description="Conversacion sobre actualidad, historia y tactica del Real Madrid con Gemini."
      />

      <section className="section-shell content-section">
        <MadridistaChatbot />
      </section>
    </>
  )
}
