import React, { useEffect, useState, } from "react";
import { Grid } from '@material-ui/core/';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@mui/material/TextField";
import { Link } from 'react-router-dom';
import PreviewIcon from '@mui/icons-material/Preview';
import { DateRange } from "@mui/icons-material";
import { SERVER_URL } from "../env";
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#EDF2FB",
        display: 'block',
        height: '100%',
    },
    divRoot: {
        paddingTop: 25,
        paddingRight: 30,
        paddingLeft: 30,
        paddingBottom: 30,
    },
    media: {
        height: 230,
    },
    pgTitle: {
        paddingTop: 15,
        paddingLeft: 30,
        color: "#ABC4FF",
        fontSize: 50,
        display: "inline-block",
    },
    root2: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CCDBFD"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ABC4FF"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ABC4FF"
        },
        "&:hover .MuiInputLabel-outlined": {
            color: "#ABC4FF"
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "#ABC4FF"
        }
    },
});

const theme = createTheme({
    typography: {
        fontFamily: [
            'Manrope',
            'Light 300',
        ].join(','),
    },
});


function AllPosts() {
    const classes = useStyles();
    const [query, setQuery] = useState("");
    //console.log(query);
    const [posts, setPosts] = useState([]);
    useEffect(async () => {
        try {
            const posts = await axios.get(`${SERVER_URL}/post/allposts`);
            console.log(posts);
            setPosts(posts.data);
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (

        <ThemeProvider theme={theme}>
            <>
                <span><h1 className={classes.pgTitle}>All Posts</h1></span>
                <span style={{ marginLeft: "15%" }} >
                    <span className="main">
                        <div className="search">
                            <TextField
                                className={classes.root2}
                                id="outlined-basic"
                                variant="outlined"
                                fullWidth
                                label="Search for items to swap"
                                onChange={event => setQuery(event.target.value)}
                            />
                        </div>
                    </span>
                </span>

                <div className={classes.divRoot}>
                    <Grid
                        container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        {posts.filter(post => {
                            if (query === ''){
                                return post;
                            }
                            else if (post.postName.toLowerCase().includes(query.toLowerCase())) {
                                return post;
                            }
                        }).map(post => (
                            <Grid item xs={12} sm={6} md={3} lg={2}
                                key={posts.indexOf(post)}>
                                <Link to={"/userpost"} state={{ post: post }} className='button-link'>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardMedia
                                                className={classes.media}
                                                image={post.postImg}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {post.postName}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" component="p">
                                                    {post.postDescription}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </>
        </ThemeProvider>
    )
}

export default AllPosts;