"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScreenSeparator from "../../components/ScreenSeparator";
import ProfileIntro from "../../components/ProfileIntro";
import { IoChevronDownOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";

const BrandForm = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const toggleInfo = () => {
    setIsInfoVisible((prev) => !prev);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const translations = {
    en: {
      title: "Contact Details - Branding",
      intro: [
        "Hello! I'm Iván Nevares, a designer and developer.",
        "I work with entrepreneurs and businesses from all over, helping them bring their brand to life through design and a visual strategy aligned with their essence.",
        "If you feel it's time to create an identity that truly represents your business or refresh the one you already have to reflect its evolution, I'm here to guide you through the process.",
        "If your brand goes beyond what you sell and you want it to tell a story, convey a purpose, and have a unique personality, my branding service is for you. Let's build an identity together that connects and endures."
      ],
      formTitle: "Branding Questionnaire",
      required: "Indicates required question",
      submit: "Submit",
      switchLanguage: "Ver en Español",
      successMessage: "Thank you! Your form has been submitted successfully. We'll contact you soon.",
      errorMessage: "There was an error submitting your form. Please try again later.",
      submitting: "Submitting...",
      questions: [
        {
          id: "email",
          label: "Email*",
          description: "(Please provide your email so we can contact you).",
          type: "email",
          required: true
        },
        {
          id: "name",
          label: "Your name*",
          description: "(What's your name?).",
          type: "text",
          required: true
        },
        {
          id: "businessName",
          label: "What's the name of your business or brand?*",
          description: "(If you already have a name, share it with us).",
          type: "text",
          required: true
        },
        {
          id: "socialMedia",
          label: "Attach the link to your Instagram, website, or social media",
          description: "(If you have social media or a website, share it so we can learn more about your brand).",
          type: "text",
          required: false
        },
        {
          id: "location",
          label: "Country and city*",
          description: "(Where is your business located?).",
          type: "text",
          required: true
        },
        {
          id: "industry",
          label: "What do you offer? (Industry)*",
          description: "(Briefly describe your business, product, or service).",
          type: "textarea",
          required: true
        },
        {
          id: "purpose",
          label: "What's your brand's purpose?",
          description: "(What motivates you to do what you do? What's your \"why\"?).",
          type: "textarea",
          required: false
        },
        {
          id: "audience",
          label: "Who is your target audience?",
          description: "(Describe your ideal customer: age, gender, interests, etc.).",
          type: "textarea",
          required: false
        },
        {
          id: "visualReferences",
          label: "Do you have any visual references or styles you like?",
          description: "(You can attach images, links, or describe styles that inspire you).",
          type: "file",
          required: false
        },
        {
          id: "values",
          label: "What values or emotions do you want your brand to convey?",
          description: "(Example: trust, innovation, fun, elegance, etc.).",
          type: "textarea",
          required: false
        },
        {
          id: "currentLogo",
          label: "Do you have a current logo or visual identity?",
          description: "(If you do, attach it or describe it).",
          type: "file",
          required: false
        },
        {
          id: "motivation",
          label: "Why do you want to improve your brand identity at this moment?*",
          description: "(Tell us what motivated you to seek a change or create a new branding).",
          type: "textarea",
          required: true
        },
        {
          id: "revenue",
          label: "What's your approximate monthly revenue?",
          description: "(This helps us understand the size of your business and offer a suitable solution).",
          type: "select",
          options: [
            "Prefer not to say",
            "Less than $1,000",
            "$1,000 - $5,000",
            "$5,000 - $10,000",
            "$10,000 - $50,000",
            "More than $50,000"
          ],
          required: false
        },
        {
          id: "budget",
          label: "How much are you willing to invest in your branding?*",
          description: "(It's important for us to know your budget to offer you a tailored service).",
          type: "select",
          options: [
            "Less than $500",
            "$500 - $1,000",
            "$1,000 - $2,500",
            "$2,500 - $5,000",
            "More than $5,000"
          ],
          required: true
        },
        {
          id: "additional",
          label: "Is there anything else you'd like to share with us?",
          description: "(If there's anything else you consider relevant, write it here).",
          type: "textarea",
          required: false
        }
      ]
    },
    es: {
      title: "Detalles de Contacto - Branding",
      intro: [
        "¡Hola! Soy Iván Nevares, diseñador y desarrollador.",
        "Trabajo con emprendedores y empresas de todas partes, ayudándoles a dar vida a su marca a través del diseño y una estrategia visual alineada con su esencia.",
        "Si sentís que es momento de crear una identidad que realmente represente a tu negocio o refrescar la que ya tenés para reflejar su evolución, estoy aquí para guiarte en el proceso.",
        "Si tu marca va más allá de lo que vendes y quieres que cuente una historia, transmita un propósito y tenga una personalidad única, mi servicio de branding es para vos. Construyamos juntos una identidad que conecte y perdure."
      ],
      formTitle: "Cuestionario de Branding",
      required: "Indica pregunta obligatoria",
      submit: "Enviar",
      switchLanguage: "View in English",
      successMessage: "¡Gracias! Tu formulario ha sido enviado con éxito. Nos pondremos en contacto contigo pronto.",
      errorMessage: "Hubo un error al enviar tu formulario. Por favor, inténtalo de nuevo más tarde.",
      submitting: "Enviando...",
      questions: [
        {
          id: "email",
          label: "Email*",
          description: "(Por favor proporciona tu email para que podamos contactarte).",
          type: "email",
          required: true
        },
        {
          id: "name",
          label: "Tu nombre*",
          description: "(¿Cómo te llamas?).",
          type: "text",
          required: true
        },
        {
          id: "businessName",
          label: "¿Cuál es el nombre de tu negocio o marca?*",
          description: "(Si ya tienes un nombre, compártelo con nosotros).",
          type: "text",
          required: true
        },
        {
          id: "socialMedia",
          label: "Adjunta el enlace a tu Instagram, sitio web o redes sociales",
          description: "(Si tienes redes sociales o un sitio web, compártelo para que podamos conocer más sobre tu marca).",
          type: "text",
          required: false
        },
        {
          id: "location",
          label: "País y ciudad*",
          description: "(¿Dónde está ubicado tu negocio?).",
          type: "text",
          required: true
        },
        {
          id: "industry",
          label: "¿Qué ofreces? (Industria)*",
          description: "(Describe brevemente tu negocio, producto o servicio).",
          type: "textarea",
          required: true
        },
        {
          id: "purpose",
          label: "¿Cuál es el propósito de tu marca?",
          description: "(¿Qué te motiva a hacer lo que haces? ¿Cuál es tu \"por qué\"?).",
          type: "textarea",
          required: false
        },
        {
          id: "audience",
          label: "¿Quién es tu público objetivo?",
          description: "(Describe a tu cliente ideal: edad, género, intereses, etc.).",
          type: "textarea",
          required: false
        },
        {
          id: "visualReferences",
          label: "¿Tienes referencias visuales o estilos que te gusten?",
          description: "(Puedes adjuntar imágenes, enlaces o describir estilos que te inspiren).",
          type: "file",
          required: false
        },
        {
          id: "values",
          label: "¿Qué valores o emociones quieres que transmita tu marca?",
          description: "(Ejemplo: confianza, innovación, diversión, elegancia, etc.).",
          type: "textarea",
          required: false
        },
        {
          id: "currentLogo",
          label: "¿Tienes un logo o identidad visual actual?",
          description: "(Si lo tienes, adjúntalo o descríbelo).",
          type: "file",
          required: false
        },
        {
          id: "motivation",
          label: "¿Por qué quieres mejorar la identidad de tu marca en este momento?*",
          description: "(Cuéntanos qué te motivó a buscar un cambio o crear un nuevo branding).",
          type: "textarea",
          required: true
        },
        {
          id: "revenue",
          label: "¿Cuál es tu ingreso mensual aproximado?",
          description: "(Esto nos ayuda a entender el tamaño de tu negocio y ofrecerte una solución adecuada).",
          type: "select",
          options: [
            "Prefiero no decir",
            "Menos de $1,000",
            "$1,000 - $5,000",
            "$5,000 - $10,000",
            "$10,000 - $50,000",
            "Más de $50,000"
          ],
          required: false
        },
        {
          id: "budget",
          label: "¿Cuánto estás dispuesto a invertir en tu branding?*",
          description: "(Es importante para nosotros conocer tu presupuesto para ofrecerte un servicio a medida).",
          type: "select",
          options: [
            "Menos de $500",
            "$500 - $1,000",
            "$1,000 - $2,500",
            "$2,500 - $5,000",
            "Más de $5,000"
          ],
          required: true
        },
        {
          id: "additional",
          label: "¿Hay algo más que te gustaría compartir con nosotros?",
          description: "(Si hay algo más que consideres relevante, escríbelo aquí).",
          type: "textarea",
          required: false
        }
      ]
    }
  };

  const currentTranslation = translations[language];

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Get form data from the event
      const formData = new FormData(e.currentTarget);
      
      // Send form data to our API route
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: formData, // FormData handles file uploads automatically
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: currentTranslation.successMessage,
        });
        // Reset form on success
        (e.target as HTMLFormElement).reset();
        
        // Scroll to the top of the form to show the success message
        window.scrollTo({ top: (e.target as HTMLFormElement).offsetTop - 100, behavior: 'smooth' });
      } else {
        setSubmitStatus({
          success: false,
          message: `${currentTranslation.errorMessage}: ${result.message || 'Unknown error'}`,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: currentTranslation.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#0C1014] text-light-gray overflow-x-hidden">
      <ScreenSeparator />
      <div className="flex-grow flex flex-col md:flex-row bg-[#3D3D3E] rounded-xl m-4 border border-mid-gray/50 relative overflow-hidden">
        {/* Sidebar - Ivan Nevares Info */}
        <div className="w-full md:w-1/4 px-6 md:px-6 py-6 flex flex-col justify-between md:border-r border-mid-gray/50 h-auto md:h-full relative">
          <div>
            <Link href="/">
              <h1 className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray cursor-pointer relative">
                Iván Nevares
              </h1>
            </Link>
          </div>

          {/* Info Section for Mobile */}
          <div className="md:hidden border-b border-t border-mid-gray/50 -mx-6 px-6 py-4">
            <button
              onClick={toggleInfo}
              className="text-lima w-full text-left py-2 px-4 flex items-center justify-between border border-mid-gray/50 rounded-md"
            >
              Info
              <motion.span
                animate={{ rotate: isInfoVisible ? 180 : 0 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <IoChevronDownOutline size={20} />
              </motion.span>
            </button>
            <motion.div
              className={`overflow-hidden ${
                isInfoVisible ? "max-h-[500px]" : "max-h-0"
              }`}
              initial={false}
              animate={{
                maxHeight: isInfoVisible ? "500px" : "0px",
                opacity: isInfoVisible ? 1 : 0
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                opacity: {
                  duration: 0.3,
                  ease: "easeInOut"
                }
              }}
            >
              <ProfileIntro />
            </motion.div>
          </div>

          {/* Info remains visible for desktop */}
          <div className="hidden md:block border-b border-t border-mid-gray md:border-none -mx-6 px-6 pt-4">
            <ProfileIntro />
          </div>
        </div>

        {/* Main Content - Form with Branding Intro */}
        <div className="w-full md:w-3/4 p-6 flex flex-col justify-between items-start text-left rounded-xl relative overflow-y-auto flex-grow">
          <div className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-helveticaNowDisplayBold text-lima">
                {currentTranslation.title}
              </h2>
              
              {/* Language Toggle moved to main component */}
              <button 
                onClick={toggleLanguage}
                className="text-lima hover:underline text-sm border border-lima/30 px-3 py-1 rounded-md"
              >
                {currentTranslation.switchLanguage}
              </button>
            </div>
            
            {/* Branding Introduction with increased spacing */}
            <div className="mb-12 space-y-4 text-light-gray">
              {currentTranslation.intro.map((paragraph, index) => (
                <p key={index} className="text-sm">{paragraph}</p>
              ))}
            </div>
            
            <h3 className="text-xl mb-6 text-mid-gray">
              {currentTranslation.formTitle}
            </h3>
            <p className="text-sm italic mb-8 text-mid-gray">
              {currentTranslation.required}
            </p>

            {/* Form with email handling functionality */}
            <form 
              className="space-y-8 w-full"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Status message */}
              {submitStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-md mb-6 ${submitStatus.success ? 'bg-green-800/20 text-green-400 border border-green-800/30' : 'bg-red-800/20 text-red-400 border border-red-800/30'}`}
                >
                  <div className="flex items-center">
                    {submitStatus.success ? (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {submitStatus.message}
                  </div>
                </motion.div>
              )}
              
              {currentTranslation.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label htmlFor={question.id} className="block text-light-gray font-medium">
                    {question.label}
                  </label>
                  
                  {question.type === "textarea" ? (
                    <textarea
                      id={question.id}
                      name={question.id}
                      required={question.required}
                      rows={4}
                      placeholder={question.description.replace(/^\(|\)\.$/g, '')}
                      className="w-full px-3 py-2 bg-[#2A2A2B] border border-mid-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-lima text-light-gray placeholder:text-mid-gray/70"
                    />
                  ) : question.type === "select" ? (
                    <select
                      id={question.id}
                      name={question.id}
                      required={question.required}
                      className="w-full px-3 py-2 bg-[#2A2A2B] border border-mid-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-lima text-light-gray"
                    >
                      <option value="">{question.description.replace(/^\(|\)\.$/g, '')}</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : question.type === "file" ? (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor={question.id}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-mid-gray/50 border-dashed rounded-lg cursor-pointer bg-[#2A2A2B] hover:bg-[#323233]"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-3 text-mid-gray" />
                          <p className="mb-2 text-sm text-mid-gray">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-mid-gray">{question.description.replace(/^\(|\)\.$/g, '')}</p>
                        </div>
                        <input 
                          id={question.id} 
                          name={question.id}
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.svg,.pdf"
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={question.type}
                      id={question.id}
                      name={question.id}
                      required={question.required}
                      placeholder={question.description.replace(/^\(|\)\.$/g, '')}
                      className="w-full px-3 py-2 bg-[#2A2A2B] border border-mid-gray/50 rounded-md focus:outline-none focus:ring-2 focus:ring-lima text-light-gray placeholder:text-mid-gray/70"
                    />
                  )}
                </div>
              ))}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-lima text-[#0C1014] font-medium py-2 px-6 rounded-md transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-lima/90'
                  }`}
                >
                  {isSubmitting ? currentTranslation.submitting : currentTranslation.submit}
                </button>
              </div>
            </form>
            
            {/* 
              EMAIL FUNCTIONALITY IMPLEMENTATION OPTIONS:
              
              Option 1: Use a form backend service
              - Services like Formspree, Netlify Forms, or FormSubmit
              - Example with Formspree:
                <form action="https://formspree.io/f/your-form-id" method="POST">
              
              Option 2: Create a serverless API route in Next.js
              - Create an API route in pages/api/submit-form.js
              - Use nodemailer or similar library to send emails
              - Submit form data to this API route using fetch or axios
              
              Option 3: Use a third-party service like EmailJS
              - Integrate EmailJS directly in the frontend
              - No backend needed, but requires client-side JavaScript
              
              For file uploads, you'll need:
              - Storage solution (AWS S3, Cloudinary, etc.)
              - Proper multipart/form-data handling
            */}
          </div>
        </div>
      </div>

      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between w-full">
        <div>{new Date().getFullYear()}</div>
        <div>UX/UI - Web Design - Front-End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default BrandForm;
