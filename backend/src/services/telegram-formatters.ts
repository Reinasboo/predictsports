/**
 * Format messages for Telegram display
 */

export function formatWelcomeMessage(): string {
  return `🎯 *Welcome to Predictsports*

I'm your AI sports prediction assistant. I provide real-time match analysis, win probabilities, and expert insights using advanced ML models. Plus, live Premier League data!

*Available Commands:*
/today - Today's fixtures & predictions
/match Team A vs Team B - Predict a specific match
/gameweek - All upcoming fixtures
/analyze Player/Team - Player stats or team form
/table - Premier League standings
/help - Show all commands

*Example:*
/match Manchester City vs Arsenal
/analyze Erling Haaland
/table

Let's predict some matches! ⚽`;
}

export function formatHelpMessage(): string {
  return `📋 *Predictsports Commands*

*Predictions:*
/today - Today's featured matches
/match <Team A> vs <Team B> - Predict specific match
/gameweek - Upcoming week's fixtures

*Premier League:*
/analyze <Player/Team> - Player stats or team form
/table - Premier League standings

*Info:*
/start - Welcome message
/help - This menu

*Example Usage:*
/match Chelsea vs Manchester United
/analyze Erling Haaland
/table

Questions? I'm here to help! 💡`;
}

export function formatMatchPrediction(match: any): string {
  const homeTeam = match.homeTeam || 'Team A';
  const awayTeam = match.awayTeam || 'Team B';
  const homeWin = (match.predictions?.homeWinProb * 100).toFixed(1);
  const draw = (match.predictions?.drawProb * 100).toFixed(1);
  const awayWin = (match.predictions?.awayWinProb * 100).toFixed(1);
  const xG = match.expectedGoals || { home: 1.5, away: 1.2 };
  const overUnder = match.predictions?.overUnder || 2.5;
  const confidence = match.predictions?.confidence || 'Medium';

  return `⚽ *${homeTeam} vs ${awayTeam}*

*Win Probabilities:*
🏠 ${homeTeam}: ${homeWin}%
🤝 Draw: ${draw}%
✈️  ${awayTeam}: ${awayWin}%

*Expected Goals:*
${homeTeam}: ${xG.home}
${awayTeam}: ${xG.away}

*Over/Under 2.5:* 
Over: ${(match.predictions?.overProb || 0.55) * 100}% | Under: ${(match.predictions?.underProb || 0.45) * 100}%

*Confidence:* ${confidence}
📊 *Top Scoreline:* ${match.predictions?.topScoreline || '2-1'}`;
}

export function formatTodayFixtures(fixtures: any[]): string {
  if (!fixtures || fixtures.length === 0) {
    return '⚽ No matches today. Check back soon!';
  }

  let message = '📅 *Today\'s Matches*\n\n';

  fixtures.slice(0, 5).forEach((match, idx) => {
    const home = match.homeTeam?.name || 'Team A';
    const away = match.awayTeam?.name || 'Team B';
    const homeWin = match.predictions?.homeWinProb 
      ? (match.predictions.homeWinProb * 100).toFixed(0) 
      : '?';
    const confidence = match.predictions?.confidence || 'Medium';

    message += `${idx + 1}. *${home} vs ${away}*\n`;
    message += `   Win Prob: ${homeWin}% | Confidence: ${confidence}\n\n`;
  });

  message += `Use /match Team A vs Team B for full details`;
  return message;
}

export function formatGameweek(fixtures: any[]): string {
  if (!fixtures || fixtures.length === 0) {
    return '📊 No upcoming fixtures found.';
  }

  let message = '📊 *Upcoming Fixtures (by confidence)*\n\n';

  // Sort by confidence
  const sorted = [...fixtures].sort((a, b) => {
    const confA = a.predictions?.confidence || 0;
    const confB = b.predictions?.confidence || 0;
    return confB - confA;
  });

  sorted.slice(0, 8).forEach((match, idx) => {
    const home = match.homeTeam?.name || 'Team A';
    const away = match.awayTeam?.name || 'Team B';
    const homeWin = match.predictions?.homeWinProb 
      ? (match.predictions.homeWinProb * 100).toFixed(0)
      : '?';
    const confidence = match.predictions?.confidence || 'Medium';
    const date = match.kickoff ? new Date(match.kickoff).toLocaleDateString() : 'TBD';

    message += `${idx + 1}. ${home} vs ${away}\n`;
    message += `   📅 ${date} | 🏆 ${homeWin}% | 📈 ${confidence}\n`;
  });

  message += `\nUse /match to get details on any match`;
  return message;
}

export function formatTeamAnalysis(team: any): string {
  return `📈 *${team.name} - Form Summary*

*Recent Results:*
Wins: ${team.wins || 0} | Draws: ${team.draws || 0} | Losses: ${team.losses || 0}

*Goals:*
For: ${team.goalsFor || 0} | Against: ${team.goalsAgainst || 0}
Goal Diff: ${(team.goalsFor || 0) - (team.goalsAgainst || 0)}

*Form:* ${team.form || 'Stable'}
*Momentum:* ${team.momentum || 'Neutral'}

*Next Match:* ${team.nextMatch || 'TBD'}

Use /match to predict upcoming games 🎯`;
}

export function formatNotFound(query: string): string {
  return `🔍 *Match Not Found*

Could not find a match for: "${query}"

*Try:*
• /today - See today's fixtures
• /gameweek - See all upcoming matches
• /help - View all commands

Need help? Use exact team names! ⚽`;
}

export function formatNoFixtures(): string {
  return `📭 No fixtures available at the moment.

Check back soon! ⚽`;
}

export function formatError(context: string): string {
  return `⚠️ *Error*

Something went wrong while ${context}.

Please try again later or use /help for commands.

*Contact:* Report issues to @predictsports 🤖`;
}

/**
 * Format player statistics from Premier League API
 */
export function formatPlayerStats(player: any): string {
  return `👤 *${player.name || 'Player'}*

*Position:* ${player.position || 'N/A'}
*Club:* ${player.club || 'N/A'}
*Nationality:* ${player.nationality || 'N/A'}
*Date of Birth:* ${player.dateOfBirth || 'N/A'}
*Height:* ${player.height || 'N/A'}

*Key Stats:*
${formatPlayerStatsData(player.keyStats)}

_Data from Premier League_ ⚽`;
}

/**
 * Format player key stats object
 */
function formatPlayerStatsData(stats: any): string {
  if (!stats) return 'No stats available';

  let formatted = '';

  if (typeof stats === 'string') {
    formatted = stats;
  } else if (typeof stats === 'object') {
    // Format object stats
    Object.entries(stats).forEach(([key, value]) => {
      formatted += `• ${key}: ${value}\n`;
    });
  }

  return formatted || 'No stats available';
}

/**
 * Format Premier League table standings
 */
export function formatLeagueTable(table: any[]): string {
  if (!table || table.length === 0) {
    return '📊 League table unavailable';
  }

  let message = '🏆 *Premier League Table*\n\n';
  message += '`POS | TEAM              | P  | W  | D  | L  | GD | PTS`\n';
  message += '`────────────────────────────────────────────────────`\n';

  // Show top 10 and bottom 3
  const topTeams = table.slice(0, 10);
  const bottomTeams = table.slice(-3);

  topTeams.forEach((row, idx) => {
    const pos = String(row.position || idx + 1).padStart(2);
    const team = (row.team || 'Team').substring(0, 15).padEnd(15);
    const played = String(row.played || 0).padStart(2);
    const wins = String(row.wins || 0).padStart(2);
    const draws = String(row.draws || 0).padStart(2);
    const losses = String(row.losses || 0).padStart(2);
    const gd = String(row.goalDifference || 0).padStart(2);
    const pts = String(row.points || 0).padStart(3);

    message += `\`${pos} | ${team} | ${played} | ${wins} | ${draws} | ${losses} | ${gd} | ${pts}\`\n`;
  });

  if (bottomTeams.length > 0) {
    message += `\`────────────────────────────────────────────────────\`\n`;

    bottomTeams.forEach((row, idx) => {
      const pos = String(row.position || '?').padStart(2);
      const team = (row.team || 'Team').substring(0, 15).padEnd(15);
      const played = String(row.played || 0).padStart(2);
      const wins = String(row.wins || 0).padStart(2);
      const draws = String(row.draws || 0).padStart(2);
      const losses = String(row.losses || 0).padStart(2);
      const gd = String(row.goalDifference || 0).padStart(2);
      const pts = String(row.points || 0).padStart(3);

      message += `\`${pos} | ${team} | ${played} | ${wins} | ${draws} | ${losses} | ${gd} | ${pts}\`\n`;
    });
  }

  message += '\n_Updated from Premier League_ 🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  return message;
}
