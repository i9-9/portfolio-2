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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-helveticaNowDisplayBold">
            {t('about.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 overflow-hidden rounded-md">
              <Image
                src="/profile.jpeg"
                alt="Ivan Nevares"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-helveticaNowDisplayBold">Ivan Nevares</h2>
              <p className="text-sm text-muted-foreground">UX/UI Designer & Front-End Developer</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">UI/UX</Badge>
              </div>
            </div>
          </div>
          <DialogDescription className="text-foreground whitespace-pre-line">
            {t('about.content')}
          </DialogDescription>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('button.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 