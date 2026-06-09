export function formatTime(isoDate: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(isoDate));
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function getRiskLabel(score: number) {
  if (score >= 85) {
    return 'Baixo';
  }

  if (score >= 68) {
    return 'Moderado';
  }

  return 'Critico';
}
