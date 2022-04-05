import React, { useEffect, useState, } from "react";
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Done, Upload } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FlagIcon from '@mui/icons-material/Flag';
import PreviewIcon from '@mui/icons-material/Preview';
import MessageIcon from '@mui/icons-material/Message';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Map from './../components/Map.js'
import { Grid } from '@material-ui/core/';
import { flexbox } from "@mui/system";
import BidCard from "./../components/BidCard";
import axios from 'axios';
import './Reports.css';
import { SERVER_URL } from "../env";


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const theme = createTheme({
    typography: {
        fontFamily: [
            'Manrope',
            'Light 300',
        ].join(','),
    },
});

const useStyles = makeStyles({
    addIcon: {
        '& svg': {
            fontSize: 75,
            color: "#ABC4FF",
        }
    },
    outerDiv: {
        marginTop: 25,
        marginBottom: 25
    },
    gridSty: {
        minHeight: '100vh'
    },
    card: {
        maxWidth: 1045,
        backgroundColor: "#EDF2FB",
        boxShadow: "10px 10px #D7E3FC"
    },
    tradeDet: {
        color: "#ABC4FF",
    },
    avtr: {
        bgcolor: "#ABC4FF",
        height: '70px',
        width: '70px',
    },
    actionText: {
        color: "#ABC4FF",
        fontSize: 20,
    },
    trdTitle: {
        marginBottom: 15,
        color: "#ABC4FF",
        fontSize: 50
    },
    btmGrid: {
        display: 'flex',
    },
    cardHeadTitle: {
        color: "#ABC4FF",
        fontSize: 40,
    },

});


function nameToInitials(name) {
    //const fullName = name.split(' ');
    const initials = name.charAt(0);//fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
}


function ReportPost() {
    let { state } = useLocation();
    //console.log(state);
    const [post, setPost] = useState(state[0]);
    const [report, setReport] = useState(state[1]);
    //console.log(post);
    //console.log(report)
    const [location, setLocation] = useState([]);
    useEffect(async () => {
        try {
            //console.log(post.listingAddress);
            const locresp = await axios.post(`${process.env.REACT_APP_API_URL}/listingcoords`, { address: post.listingAddress });
            //console.log(locresp.data.mapinfo);
            setLocation(locresp.data.mapinfo);
        } catch (error) {
            console.log(error);
        }
    }, []);
    //console.log({ locationgoogle: location });

    const [offers, setOffers] = useState([]);
    useEffect(async () => {
        try {
            //console.log(post._id);
            const resp = await axios.get(`${process.env.REACT_APP_API_URL}/offer/${post._id}`);
            //console.log(resp.data.offers);
            setOffers(resp.data.offers);
        } catch (error) {
            console.log(error);
        }
    }, []);

    async function handleIgnore(){
        try{
            await axios.delete(`${SERVER_URL}report/${report}`);
            window.history.go(-1);
        }catch(err){
            console.log(err);
        }
    }

    async function handleRemove(){
        try{
            await axios.delete(`${SERVER_URL}report/report/${report}`);
            await axios.delete(`${SERVER_URL}post/${post._id}`);
            window.history.go(-1);
        } catch(err){
            console.log(err);
        }
    }

    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.outerDiv}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    className={classes.gridSty}
                >
                    <Grid item>
                        
                        <Card sx={{ maxWidth: 1045, backgroundColor: "#EDF2FB", boxShadow: "10px 10px #D7E3FC" }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: "#ABC4FF", height: '70px', width: '70px' }} aria-label="recipe">
                                        {nameToInitials(post.userName)}
                                    </Avatar>
                                }
                                title={<span className={classes.cardHeadTitle}>{post.postName}</span>}
                                subheader={post.createdAt}
                            />
                            <CardMedia
                                component="img"
                                height="500"
                                image={post.postImg}
                                alt="Item image"
                            />
                            <CardContent>
                                <Typography variant="body1">
                                    <h2>Summary</h2>
                                    {post.postDescription}

                                </Typography>
                                <br></br>
                                <Typography variant="body1" color="text.secondary">
                                    <h2>Trade Details</h2>
                                    <span className={classes.tradeDet}><b>Trademate:</b></span> {post.userName}
                                    <br></br>
                                    <span className={classes.tradeDet}><b>Preferred exchange location:</b></span> {post.listingAddress}
                                </Typography>
                                <Map location={location} zoomLevel={17} />
                            </CardContent>
                            <CardActions disableSpacing>
                                <Link to={"/messages"} className='button-link'>
                                    <Button size="small" color="primary">
                                        <IconButton aria-label="message trademate">
                                            <MessageIcon className={classes.tradeDet} /> <span className={classes.actionText}>Message Trademate</span>
                                        </IconButton>
                                    </Button>
                                </Link>
                            </CardActions>
                            
                            <button className = "buttons2" onClick = {handleIgnore}> Ignore Report </button>
                            <button className = "buttons2" onClick = {handleRemove}> Remove Post </button>
                        </Card>
                    </Grid>

                </Grid>
            </div>

        </ThemeProvider>
    );
}

export default ReportPost