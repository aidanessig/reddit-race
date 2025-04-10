export function bfs(graph, start, goal) {
    if (start === goal) return [start];
  
    const queue = [[start]];
    const visited = new Set();
    visited.add(start);
  
    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];
  
      const neighbors = (graph[node] || []).map(n => n.subreddit);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          const newPath = [...path, neighbor];
          if (neighbor === goal) return newPath;
          queue.push(newPath);
          visited.add(neighbor);
        }
      }
    }
  
    return null;
  }