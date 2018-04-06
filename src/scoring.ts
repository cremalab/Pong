var s1 = 0;
var s2 = 0;
export const addTeam1Score = () => {
  s1++;
  (document.getElementById('t1Score') as HTMLElement).textContent = `${s1}`;
};

export const addTeam2Score = () => {
  s2++;
  (document.getElementById('t2Score') as HTMLElement).textContent = `${s2}`;
};