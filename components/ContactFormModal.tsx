"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('form.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('form.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.invalidEmail');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('form.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[110] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] bg-background/95 backdrop-blur-md" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[110] flex h-[100dvh] w-full flex-col bg-background duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] md:inset-auto md:left-[50%] md:top-[50%] md:h-auto md:max-h-[min(88dvh,46rem)] md:w-[min(90vw,42rem)] md:translate-x-[-50%] md:translate-y-[-50%] md:border md:border-border/40"
        >
          {/* Close button - top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:right-8 md:top-8"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex min-h-0 flex-1 flex-col px-6 py-12 md:px-16 md:py-16">
            {/* Editorial Header */}
            <div className="mb-12 max-w-2xl md:mb-16">
              <h2 className="mb-4 text-3xl font-helveticaNowDisplayBold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                {t('form.title')}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {t('form.subtitle')}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain pb-8 md:space-y-10">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="name" 
                    className="block text-xs font-medium uppercase tracking-wider text-foreground/70"
                  >
                    {t('form.name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(
                      "h-14 border-0 border-b-2 bg-transparent px-0 text-base shadow-none transition-colors focus-visible:ring-0 md:h-16 md:text-lg",
                      errors.name 
                        ? "border-b-red-500" 
                        : "border-b-border/40 focus-visible:border-b-foreground"
                    )}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-red-500"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="email" 
                    className="block text-xs font-medium uppercase tracking-wider text-foreground/70"
                  >
                    {t('form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "h-14 border-0 border-b-2 bg-transparent px-0 text-base shadow-none transition-colors focus-visible:ring-0 md:h-16 md:text-lg",
                      errors.email 
                        ? "border-b-red-500" 
                        : "border-b-border/40 focus-visible:border-b-foreground"
                    )}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <Label 
                    htmlFor="message" 
                    className="block text-xs font-medium uppercase tracking-wider text-foreground/70"
                  >
                    {t('form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={cn(
                      "min-h-[160px] resize-none border-0 border-b-2 bg-transparent px-0 text-base shadow-none transition-colors focus-visible:ring-0 md:min-h-[200px] md:text-lg",
                      errors.message 
                        ? "border-b-red-500" 
                        : "border-b-border/40 focus-visible:border-b-foreground"
                    )}
                    disabled={isSubmitting}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-red-500"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      className="border-l-2 border-green-500 bg-green-500/5 py-4 pl-4 pr-6"
                    >
                      <p className="text-sm text-green-600 md:text-base">
                        {t('form.success')}
                      </p>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      className="border-l-2 border-red-500 bg-red-500/5 py-4 pl-4 pr-6"
                    >
                      <p className="text-sm text-red-600 md:text-base">
                        {t('form.error')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="shrink-0 pt-8 md:pt-10">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full text-base font-medium tracking-wide transition-opacity md:h-16 md:text-lg"
                >
                  {isSubmitting ? t('form.sending') || "Sending..." : t('form.send')}
                </Button>
              </div>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
} 