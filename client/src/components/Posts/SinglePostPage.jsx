import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { Grid, makeStyles, CardMedia, Box, Button } from "@material-ui/core";
import { deletePost, getSinglePost } from "../../redux/feautures/posts";

const useStyles = makeStyles((theme) => ({
  main: {
    width: "90%",
    color: "white",
    margin: theme.spacing(16, "auto"),
  },
  title: {
    padding: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
  infoAuthor: {
    position: "absolute",
    bottom: "0%",
    display: "flex",
    borderTop: " 1px solid grey",
    width: "100%",
    p: "10px",
  },
  footer: {
    position: "relative",
  },
  text: {
    padding: 20,
    fontSize: 20,
  },
}));

function SinglePostPage() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, currentPost } = useSelector((store) => store.posts);
  const { myData } = useSelector((store) => store.auth);
  const { postId } = useParams();
  
  const handleDeletePost = (id) => {
    dispatch(deletePost(id))
  }

  useEffect(() => {
    dispatch(getSinglePost(postId));
  }, [postId, dispatch]);

  return (
    <Grid container>
      <Header />
      {loading ? (
        <h3>loading...</h3>
      ) : (
        <Grid className={classes.main}>
          {currentPost?.title}
          <CardMedia
            image={currentPost?.author?.avatar_URI}
            className={classes.avatar}
          />
          {currentPost?.author?.name || currentPost?.author?.login}
          <Grid item xs={12} sm={12} className={classes.text}>
            {currentPost?.text}
          </Grid>
          <Box>
            {myData?._id === currentPost?.author?._id ? (
              <Button onClick={() => handleDeletePost(currentPost._id)}>
                Удалить
              </Button>
            ) : ("")}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default SinglePostPage;
