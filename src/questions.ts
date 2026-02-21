export enum QuestionType {
  INTELLIGIBILITY = 'INTELLIGIBILITY',
  NATURALNESS = 'NATURALNESS',
  LIKABILITY = 'LIKABILITY',
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  audioPath: string;
}

const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 30; i++) {
    const typeIndex = (i - 1) % 3;
    let type: QuestionType;
    let text: string;

    switch (typeIndex) {
      case 0:
        type = QuestionType.INTELLIGIBILITY;
        text = 'Listen to the audio below. Please type exactly what you hear.';
        break;
      case 1:
        type = QuestionType.NATURALNESS;
        text = 'Listen to the audio below. How natural does this voice sound? (1 = very unnatural, 5 = very natural)';
        break;
      case 2:
        type = QuestionType.LIKABILITY;
        text = 'Listen to the audio below. How pleasant does this voice sound? (1 = very unpleasant, 5 = very pleasant)';
        break;
      default:
        type = QuestionType.INTELLIGIBILITY;
        text = '';
    }

    questions.push({
      id: i,
      type,
      text,
      // User can replace these in public/audio/ folder
      audioPath: `/audio/q${i}.mp3`,
    });
  }
  return questions;
};

export const QUESTIONS = generateQuestions();
