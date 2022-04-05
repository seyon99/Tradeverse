import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FlagIcon from '@mui/icons-material/Flag';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { makeStyles, ThemeProvider, createTheme } from '@material-ui/core/styles';
import axios from 'axios';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(171, 196, 255)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

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

export default function CustomizedMenus() {
    let { state } = useLocation();
    const [post, setPost] = React.useState(state.post);
    const [userID, setUuserId] = React.useState(state.post.currUserID);
    console.log("State within tha Report Menu");
    console.log(userID);
    console.log(post);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function postReport(reqBody) {
        try {
            console.log("Posting the following report to db:");
            console.log(reqBody.user);
            console.log(reqBody);
            await axios.post(`${process.env.REACT_APP_API_URL}/report`, reqBody);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function sendReportToAdmin(reportType) {
        let reqBody = { title: `POST-${post._id}`, user: post.currUserId, reportType: "", postId: post._id };
        if (reportType === "miscont") {
            reqBody.reportType = "Misleading Content";
            await postReport(reqBody);
            handleClose();
            return;
        }
        else if (reportType === "viocont") {
            reqBody.reportType = "Violent Content";
            await postReport(reqBody);
            handleClose();
            return;
        }
        else if (reportType === "inacont") {
            reqBody.reportType = "Inappropriate Content";
            await postReport(reqBody);
            handleClose();
            return;
        }
        else if (reportType === "hatcont") {
            reqBody.reportType = "Hate Speech";
            await postReport(reqBody);
            handleClose();
            return;
        }
    }

    const classes = useStyles();

    return (
        <div>
            <IconButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                <FlagIcon className={classes.tradeDet}/> <span className={classes.actionText}>Report</span>
            </IconButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() =>{ 
                    console.log("Misleading content"); 
                    sendReportToAdmin("miscont");
                    }} disableRipple>
                    Misleading Content
                </MenuItem>
                <MenuItem onClick={() =>{ 
                    console.log("Violent Content");
                    sendReportToAdmin("viocont");
                    }} disableRipple>
                    Violent Content
                </MenuItem>
                <MenuItem onClick={() =>{ 
                    console.log("Inappropriate content");
                    sendReportToAdmin("inacont");
                    }} disableRipple>
                    Innapropriate Content
                </MenuItem>
                <MenuItem onClick={() =>{ 
                    console.log("Hate speech");
                    sendReportToAdmin("hatcont");
                    }} disableRipple>
                    Hate Speech
                </MenuItem>
            </StyledMenu>
        </div>
    );
}