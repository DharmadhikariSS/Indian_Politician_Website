import re
import logging
from deep_translator import GoogleTranslator

class RegionalTranslator:
    def __init__(self, target_lang='en'):
        self.target_lang = target_lang
        self.translator = GoogleTranslator(source='auto', target=target_lang)

    def translate_text(self, text):
        if not text or not isinstance(text, str):
            return text
        text_clean = text.strip()
        if not text_clean:
            return ""

        # Check if text contains only ascii characters (to avoid translating English again)
        try:
            text_clean.encode('ascii')
            return text_clean
        except UnicodeEncodeError:
            pass  # Contains non-ascii characters (likely Hindi/regional)

        try:
            translated = self.translator.translate(text_clean)
            logging.info(f"Translated regional text: '{text_clean[:20]}...' -> '{translated[:20]}...'")
            return translated
        except Exception as e:
            logging.warning(f"Translation failed: {e}. Retaining original regional text.")
            return text_clean

    def clean_financial_value(self, val_str):
        """
        Converts Indian currency strings (e.g. "Rs 4,50,00,000", "₹ 45 Crore+", "₹ 15 Lakhs") 
        into a standardized float representing the amount in CRORES (INR 10,000,000).
        1 Crore = 100 Lakhs = 10,000,000
        1 Lakh = 100,000 = 0.01 Crore
        """
        if not val_str or not isinstance(val_str, str):
            return 0.0

        # Remove currency symbols, commas, spaces and plus signs
        clean_str = val_str.replace("₹", "").replace("Rs", "").replace("Rs.", "").replace(",", "").replace("+", "").strip().lower()

        try:
            num_part = re.findall(r"[\d\.]+", clean_str)
            if not num_part:
                return 0.0
                
            first_num = float(num_part[0])
            
            # If the first number is a large raw rupee amount (e.g. >= 10000 Rupees),
            # normalize it directly (divide by 10,000,000) regardless of words in clean_str.
            if first_num >= 10000:
                return round(first_num / 10000000.0, 4)
                
            # Otherwise, check for crore/lakh multipliers
            if "crore" in clean_str or "cr" in clean_str:
                return first_num
            elif "lakh" in clean_str or "lac" in clean_str or "lacs" in clean_str:
                return round(first_num / 100.0, 4)
                
            # If it's a small raw number (e.g. 5000)
            return round(first_num / 10000000.0, 6)
        except ValueError:
            pass

        return 0.0

if __name__ == "__main__":
    translator = RegionalTranslator()
    
    # Test Translation
    print(translator.translate_text("राजेंद्र सिंह"))  # Expect: "Rajendra Singh"
    print(translator.translate_text("Surat Central"))  # Expect: "Surat Central" (no translation needed)
    
    # Test Currency Normalizer
    print("4,50,00,000 ->", translator.clean_financial_value("Rs 4,50,00,000"))  # Expect: 4.5
    print("45 Crore+ ->", translator.clean_financial_value("₹ 45 Crore+"))         # Expect: 45.0
    print("12 Lakhs ->", translator.clean_financial_value("₹ 12 Lakhs"))          # Expect: 0.12
    print("1,20,000 ->", translator.clean_financial_value("1,20,000"))            # Expect: 0.012
