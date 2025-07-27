// src/services/candidateService.ts

// Definiamo un "tipo" per l'oggetto Candidato, così TypeScript ci aiuta
export interface Candidate {
  id: number;
  fullName: string;
  email: string;
  status: 'pending' | 'reviewed' | 'rejected'; // Solo questi valori sono permessi
  tags: string[];
}

// Il nostro database finto
const mockCandidates: Candidate[] = [
  { id: 1, fullName: 'Mario Rossi', email: 'mario.rossi@email.com', status: 'pending', tags: ['tecnico', 'frontend'] },
  { id: 2, fullName: 'Laura Bianchi', email: 'laura.bianchi@email.com', status: 'reviewed', tags: ['hr', 'cultura'] },
  { id: 3, fullName: 'Giacomo Verdi', email: 'giacomo.verdi@email.com', status: 'rejected', tags: ['backend', 'senior'] },
  { id: 4, fullName: 'Sara Neri', email: 'sara.neri@email.com', status: 'pending', tags: ['tecnico', 'devops'] },
  { id: 5, fullName: 'Luca Gialli', email: 'luca.galli@email.com', status: 'reviewed', tags: ['frontend', 'junior'] },
  { id: 6, fullName: 'Anna Blu', email: 'anna.blu.@email.com', status: 'rejected', tags: ['hr', 'senior'] },
  { id: 7, fullName: 'Marco Grigi', email: 'marco.grigi@email.com', status: 'pending', tags: ['tecnico', 'fullstack'] },
  { id: 8, fullName: 'Agnese Rossi', email: 'agnese.rossi@email.com', status: 'reviewed', tags: ['hr', 'junior'] },
  { id: 9, fullName: 'Roberto Forti', email: 'roberto.forti@email.com', status: 'pending', tags: ['backend', 'database'] },
  { id: 10, fullName: 'Eleonora Meli', email: 'eleonora.meli@email.com', status: 'reviewed', tags: ['marketing', 'comunicazione'] },
  { id: 11, fullName: 'Paolo Conti', email: 'paolo.conti@email.com', status: 'rejected', tags: ['mobile', 'android'] },
  { id: 12, fullName: 'Francesca Riva', email: 'francesca.riva@email.com', status: 'pending', tags: ['design', 'ui/ux'] },
  { id: 13, fullName: 'Davide Leone', email: 'davide.leone@email.com', status: 'reviewed', tags: ['qa', 'automation'] },
  { id: 14, fullName: 'Giulia Greco', email: 'giulia.greco@email.com', status: 'pending', tags: ['data science', 'machine learning'] },
  { id: 15, fullName: 'Alessandro Ferrari', email: 'alessandro.ferrari@email.com', status: 'rejected', tags: ['cloud', 'aws'] },
  { id: 16, fullName: 'Chiara Marino', email: 'chiara.marino@email.com', status: 'reviewed', tags: ['hr', 'recruiting'] },
  { id: 17, fullName: 'Simone Gallo', email: 'simone.gallo@email.com', status: 'pending', tags: ['cybersecurity', 'analyst'] },
  { id: 18, fullName: 'Martina Conte', email: 'martina.conte@email.com', status: 'reviewed', tags: ['project management', 'agile'] },
  { id: 19, fullName: 'Federico Amato', email: 'federico.amato@email.com', status: 'pending', tags: ['game dev', 'unity'] },
  { id: 20, fullName: 'Elena Rinaldi', email: 'elena.rinaldi@email.com', status: 'rejected', tags: ['support', 'customer service'] },
  { id: 21, fullName: 'Giovanni Moretti', email: 'giovanni.moretti@email.com', status: 'pending', tags: ['sales', 'b2b'] },
  { id: 22, fullName: 'Sofia Ricci', email: 'sofia.ricci@email.com', status: 'reviewed', tags: ['content writer', 'seo'] },
  { id: 23, fullName: 'Marco Bruno', email: 'marco.bruno@email.com', status: 'rejected', tags: ['embedded', 'firmware'] },
  { id: 24, fullName: 'Alice Costa', email: 'alice.costa@email.com', status: 'pending', tags: ['business analyst', 'finance'] },
  { id: 25, fullName: 'Matteo Colombo', email: 'matteo.colombo@email.com', status: 'reviewed', tags: ['devops', 'kubernetes'] },
  { id: 26, fullName: 'Sara Vitale', email: 'sara.vitale@email.com', status: 'pending', tags: ['frontend', 'react'] },
  { id: 27, fullName: 'Luca Romano', email: 'luca.romano@email.com', status: 'rejected', tags: ['backend', 'java'] },
  { id: 28, fullName: 'Laura Mancini', email: 'laura.mancini@email.com', status: 'reviewed', tags: ['hr', 'onboarding'] },
]

// Esportiamo i candidati per poterli usare in altri file
export const availableTags = [...new Set(mockCandidates.flatMap(c => c.tags))].sort();

// La nostra funzione finta che simula una chiamata API
export const getCandidates = async (): Promise<Candidate[]> => {
  console.log('Chiamata al servizio API mock per ottenere i candidati...');
  
  // Simuliamo un ritardo di rete di mezzo secondo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Dati mock ricevuti.');
  return mockCandidates;
};