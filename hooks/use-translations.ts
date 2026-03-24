import { usePlantStore } from "../store/usePlantStore";
import { translations, TranslationKeys } from "../constants/translations";

export const useTranslations = () => {
  const language = usePlantStore((state) => state.settings.language);

  const t = translations[language] || translations.en;

  return { t, language };
};
