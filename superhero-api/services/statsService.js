const statsRepository = require('../repositories/statsRepository');

const getStats = async () => {
  const [
    totalHeroes,
    totalIncidents,
    heroesByStatus,
    heroesByPower,
    incidentsByStatus,
    incidentsByLevel,
    resolvedRows,
  ] = await Promise.all([
    statsRepository.getTotalHeroes(),
    statsRepository.getTotalIncidents(),
    statsRepository.getHeroesByStatus(),
    statsRepository.getHeroesByPower(),
    statsRepository.getIncidentsByStatus(),
    statsRepository.getIncidentsByLevel(),
    statsRepository.getResolvedIncidentTimestamps(),
  ]);

  let avgResolutionTimeMinutes = 0;
  if (resolvedRows.length > 0) {
    const totalMinutes = resolvedRows.reduce((sum, row) => {
      const diffMs = new Date(row.resolved_at) - new Date(row.assigned_at);
      return sum + diffMs / 60000;
    }, 0);
    avgResolutionTimeMinutes = parseFloat((totalMinutes / resolvedRows.length).toFixed(2));
  }

  return {
    totalHeroes,
    totalIncidents,
    heroesByStatus,
    heroesByPower,
    incidentsByStatus,
    incidentsByLevel,
    avgResolutionTimeMinutes,
  };
};

module.exports = { getStats };
