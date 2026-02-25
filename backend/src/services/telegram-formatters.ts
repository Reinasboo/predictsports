/**
 * Format messages for Telegram display
 */

export function formatWelcomeMessage(): string {
  return `🎯 *Welcome to Predictsports*

I'm your AI sports prediction assistant. I provide real-time match analysis, win probabilities, and expert insights using advanced ML models.

*Available Commands:*
/today - Today's fixtures & predictions
/match Team A vs Team B - Predict a specific match
/gameweek - All upcoming fixtures
/analyze Team - Team form & analysis
/help - Show this help menu

*Example:*
/match Manchester City vs Arsenal
/analyze Liverpool

Let's predict some matches! ⚽`;
}

export function formatHelpMessage(): string {
  return `📋 *Predictsports Commands*

*Predictions:*
/today - Today's featured matches
/match <Team A> vs <Team B> - Predict specific match
/gameweek - Upcoming week's fixtures

*Analysis:*
/analyze <Team> - Team form summary

*Info:*
/start - Welcome message
/help - This menu

*Example Usage:*
/match Chelsea vs Manchester United
/analyze Tottenham

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
