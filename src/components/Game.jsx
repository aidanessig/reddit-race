import { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import '../index.css';
import { bfs } from '../utils/bfs';

const Game = ({ graph, start, end, onRestart }) => {
  const [current, setCurrent] = useState(start);
  const [path, setPath] = useState([start]);
  const [highlightedSubreddit, setHighlightedSubreddit] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [optimalPath, setOptimalPath] = useState([]);
  const [activePathTab, setActivePathTab] = useState('user');

  const options = graph[current] || [];
  const hasWon = current === end;

  // timer setup
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // stop timer and get optimal path
  useEffect(() => {
    if (hasWon) {
      setTimerActive(false);
      const optimal = bfs(graph, start, end);
      if (optimal) setOptimalPath(optimal);
    }
  }, [hasWon, graph, start, end]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = (nextSub) => {
    setCurrent(nextSub);
    setPath((prev) => [...prev, nextSub]);
    setHighlightedSubreddit(null);
  };

  const giveHint = () => {
    const pathToGoal = bfs(graph, current, end);
    if (pathToGoal && pathToGoal.length > 1) {
      const nextStep = pathToGoal[1];
      setHighlightedSubreddit(nextStep);
    }
  };

  const renderPathList = (list) => (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'secondary.main',
        borderRadius: 1,
        maxHeight: 200,
        overflowY: 'auto',
        p: 2,
        mt: 2,
        backgroundColor: '#fff8e1',
      }}
    >
      <Stack spacing={1}>
        {list.map((sub, idx) => (
          <Typography key={idx} variant="body2">
            {`r/${sub}`}
          </Typography>
        ))}
      </Stack>
    </Box>
  );

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
            position: 'relative',
          }}
        >
          {/* top bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              {formatTime(secondsElapsed)}
            </Typography>
            {hasWon ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onRestart}
                sx={{ fontWeight: 'bold' }}
              >
                Play Again
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={giveHint}
                sx={{ fontWeight: 'bold' }}
              >
                Hint
              </Button>
            )}
          </Box>

          {/* destination */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="secondary"
              sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Get to
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {`r/${end}`}
            </Typography>
          </Box>

          {/* start */}
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            From: <strong>{`r/${start}`}</strong>
          </Typography>

          {hasWon ? (
            <>
              <Typography
                variant="h6"
                color="secondary"
                fontWeight="bold"
                textAlign="center"
              >
                🎉 You made it to the destination in {path.length - 1} moves!
              </Typography>

              {optimalPath.length > 0 && path.length - 1 > optimalPath.length - 1 && (
                <Typography
                  variant="body1"
                  color="text.primary"
                  textAlign="center"
                  sx={{ mt: 2 }}
                >
                  But the optimal path was {optimalPath.length - 1} moves.
                </Typography>
              )}

              {optimalPath.length > 0 && path.length - 1 === optimalPath.length - 1 && (
                <Typography
                  variant="body1"
                  color="text.primary"
                  textAlign="center"
                  sx={{ mt: 2 }}
                >
                  🎯 And you found it in the optimal number of moves!
                </Typography>
              )}

              {optimalPath.length > 0 && path.length - 1 > optimalPath.length - 1 && (
                <>
                  <ToggleButtonGroup
                    value={activePathTab}
                    exclusive
                    onChange={(e, newVal) => {
                      if (newVal !== null) setActivePathTab(newVal);
                    }}
                    sx={{ mt: 3 }}
                    fullWidth
                  >
                    <ToggleButton value="user">Your Path</ToggleButton>
                    <ToggleButton value="optimal">Optimal Path</ToggleButton>
                  </ToggleButtonGroup>
                  {renderPathList(activePathTab === 'user' ? path : optimalPath)}
                </>
              )}
            </>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ mt: 3 }} color="primary">
                Choose your next subreddit:
              </Typography>
              <Stack spacing={2} mt={2}>
                {options.map(({ subreddit }) => (
                  <Button
                    key={subreddit}
                    variant={
                      highlightedSubreddit === subreddit
                        ? 'contained'
                        : 'outlined'
                    }
                    color="secondary"
                    onClick={() => handleClick(subreddit)}
                    fullWidth
                  >
                    {`r/${subreddit}`}
                  </Button>
                ))}
                {options.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No further links from here.
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Game;
