// src/scormdriver.d.ts

declare module 'scormdriver' {
    function SCORM2004_GetPassingScore(): number | null;
    function SCORM2004_SetScore(score: number, maxScore: number, minScore: number): boolean;
    function SCORM2004_GetScore(): string;
    function SCORM2004_GetScaledScore(): string;
  }
  