import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-helveticaNowDisplayBold">
            {t('about.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-md">
              <Image
                src="/profile.jpeg"
                alt="Ivan Nevares"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-helveticaNowDisplayBold tracking-tight">Ivan Nevares</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">UX/UI Designer & Front-End Developer</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">React</Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">Next.js</Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">TypeScript</Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">UI/UX</Badge>
                <Badge variant="secondary" className="text-[10px] sm:text-xs">{t('about.graphicDesign')}</Badge>
              </div>
            </div>
          </div>
          <DialogDescription className="text-sm sm:text-base text-foreground whitespace-pre-line leading-relaxed">
            {t('about.content')}
          </DialogDescription>
          <div className="flex justify-end pt-2 sm:pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-xs sm:text-sm h-8 sm:h-10"
            >
              {t('button.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 