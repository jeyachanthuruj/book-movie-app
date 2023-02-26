/**
 * Release movie component.
 */

import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  gridListMain: {
    transform: 'translateZ(0)',
  },
  releasedMovieGridItem: {
    margin: '15px',
    cursor: 'pointer',
  },
  title: {
    color: theme.palette.primary.light,
  },
});

const ReleasedMovies = (props) => {
  const history = useHistory();
  const releasedMovies = props.releasedMovies;

  // Navigates to detail page.
  const movieClickHandler = (movieId) => {
    history.push(`/movie/${movieId}`);
  };

  const { classes } = props;

  return (
    <div>
      <ImageList rowHeight={350} cols={4} className={classes.gridListMain}>
        {releasedMovies.map((movie) => (
          <ImageListItem
            onClick={() => movieClickHandler(movie.id)}
            className={classes.releasedMovieGridItem}
            key={'grid' + movie.id}
          >
            <img
              src={movie.poster_url}
              className="movie-poster"
              alt={movie.title}
            />
            <ImageListItemBar
              title={movie.title}
              subtitle={
                <span>
                  Release Date: {new Date(movie.release_date).toDateString()}
                </span>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};
export default withStyles(styles)(ReleasedMovies);
