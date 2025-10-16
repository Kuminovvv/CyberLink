// Domain models (JSDoc for types) and constants

export const ExerciseType = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  PHISHING_DETECT: 'phishing_detect',
  URL_CHECK: 'url_check',
  PASSWORD_STRENGTH: 'password_strength',
  MFA_QUEST: 'mfa_quest'
};

export const ThreatType = {
  PHISHING: 'phishing',
  PASSWORD: 'password',
  URL: 'url',
  PRIVACY: 'privacy',
  HTTPS: 'https',
  SQLI: 'sqli',
  IR: 'ir'
};

export const Difficulty = { E1: 1, E2: 2, E3: 3 };

export function emptyUser() {
  return {
    id: 'u_local',
    nickname: 'Гость',
    locale: 'ru',
    xpTotal: 0,
    settings: { dailyGoal: 5, tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    balances: { hearts: 5, coins: 0 },
    streak: { days: 0, lastCheckInAt: null },
  };
}

