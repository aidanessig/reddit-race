import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import Game from './components/Game';
import './index.css';

function App() {
  const [graph, setGraph] = useState({});
  const [subreddits, setSubreddits] = useState([]);
  const [startSubreddit, setStartSubreddit] = useState('');
  const [endSubreddit, setEndSubreddit] = useState('');
  const [startTouched, setStartTouched] = useState(false);
  const [endTouched, setEndTouched] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    fetch('/top_subreddit_links.json')
      .then((res) => res.json())
      .then((data) => {
        const sortedSubs = Object.keys(data).sort();
        setGraph(data);
        setSubreddits(sortedSubs);
      });
  }, []);

  const isStartValid = subreddits.includes(startSubreddit);
  const isEndValid = subreddits.includes(endSubreddit);

  const pickRandomSubreddit = () =>
    subreddits[Math.floor(Math.random() * subreddits.length)];

  const startGame = () => {
    if (isStartValid && isEndValid) {
      setGameStarted(true);
    }
  };

  const resetGame = () => {
    setStartSubreddit('');
    setEndSubreddit('');
    setStartTouched(false);
    setEndTouched(false);
    setGameStarted(false);
  };

  if (!graph || Object.keys(graph).length === 0) {
    return <Typography>Loading subreddit graph...</Typography>;
  }

  if (gameStarted) {
    return (
      <Game
        graph={graph}
        start={startSubreddit}
        end={endSubreddit}
        onRestart={resetGame}
      />
    );
  }

  return (
    <div className="app-layout">
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            border: '2px solid',
            borderColor: 'secondary.main',
            borderRadius: 2,
            backgroundColor: 'background.default',
          }}
        >
          <Typography
            variant="h3"
            color="secondary"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Reddit Race
          </Typography>

          {/* validation message */}
          {(startTouched && !isStartValid) || (endTouched && !isEndValid) ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: 'center', mb: 2 }}
            >
              {!isStartValid
                ? 'Start subreddit not in current data'
                : 'Destination subreddit not in current data'}
            </Typography>
          ) : null}

          <Box mt={2}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', mb: 1 }}
              color="primary"
            >
              📍 Start
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={startSubreddit}
              onChange={(e) => setStartSubreddit(e.target.value)}
              onBlur={() => setStartTouched(true)}
              placeholder="Enter start subreddit"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const random = pickRandomSubreddit();
                        setStartSubreddit(random);
                        setStartTouched(true);
                      }}
                    >
                      <CasinoIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', mt: 4, mb: 1 }}
              color="primary"
            >
              🏆 Destination
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={endSubreddit}
              onChange={(e) => setEndSubreddit(e.target.value)}
              onBlur={() => setEndTouched(true)}
              placeholder="Enter destination subreddit"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const random = pickRandomSubreddit();
                        setEndSubreddit(random);
                        setEndTouched(true);
                      }}
                    >
                      <CasinoIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box mt={5}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={startGame}
                disabled={!isStartValid || !isEndValid}
                sx={{ fontWeight: 'bold' }}
              >
                Start Game
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;
