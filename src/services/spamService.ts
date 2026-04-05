import { isDisposableEmail } from '../utils/validators';

const spamKeywords = [
  'buy now',
  'click here',
  'limited time',
  'act now',
  'order now',
  'viagra',
  'casino',
  'lottery',
];

export const spamService = {
  checkSpam: (content: string, email: string): number => {
    let spamScore = 0;

    // Check email
    if (isDisposableEmail(email)) {
      spamScore += 0.3;
    }

    // Check for keywords
    const lowerContent = content.toLowerCase();
    const keywordMatches = spamKeywords.filter((keyword) => lowerContent.includes(keyword)).length;
    if (keywordMatches > 0) {
      spamScore += Math.min(keywordMatches * 0.15, 0.3);
    }

    // Check for excessive URLs
    const urlMatches = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (urlMatches >= 3) {
      spamScore += 0.2;
    }

    // Check for excessive caps
    const capsPercentage = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsPercentage > 0.5) {
      spamScore += 0.15;
    }

    // Check for too short comments (likely spam)
    if (content.trim().length < 10) {
      spamScore += 0.1;
    }

    // Clamp between 0 and 1
    return Math.min(spamScore, 1.0);
  },
};
