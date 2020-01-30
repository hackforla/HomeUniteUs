import * as React from 'react';
import { Container, Paper, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    sidebarAboutBox: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.grey[200],
    },
    sidebarSection: {
      marginTop: theme.spacing(3),
    },
  }));


const firstParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt dui ut ornare lectus sit amet est. Risus feugiat in ante metus dictum at tempor commodo ullamcorper. Lobortis mattis aliquam faucibus purus in. Congue quisque egestas diam in arcu cursus euismod quis viverra. Volutpat est velit egestas dui id. Quisque non tellus orci ac auctor augue mauris. Pretium vulputate sapien nec sagittis aliquam. Amet aliquam id diam maecenas ultricies mi eget mauris pharetra. Arcu non odio euismod lacinia at. Elit ut aliquam purus sit. Congue nisi vitae suscipit tellus mauris a diam maecenas sed. Purus gravida quis blandit turpis cursus in. Erat velit scelerisque in dictum non consectetur. Faucibus pulvinar elementum integer enim. Non arcu risus quis varius quam. Congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Integer malesuada nunc vel risus commodo viverra. Elit pellentesque habitant morbi tristique senectus et netus. At tempor commodo ullamcorper a lacus vestibulum sed arcu non.";
const secondParagraph = "Id diam vel quam elementum pulvinar etiam non. Sapien et ligula ullamcorper malesuada proin libero nunc consequat. Dui vivamus arcu felis bibendum. Condimentum vitae sapien pellentesque habitant morbi tristique senectus. Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Vel quam elementum pulvinar etiam. In pellentesque massa placerat duis ultricies. Semper quis lectus nulla at volutpat diam ut venenatis tellus. Aenean sed adipiscing diam donec adipiscing tristique risus nec feugiat. Nunc sed augue lacus viverra vitae. Et tortor at risus viverra adipiscing at in tellus integer. Mi bibendum neque egestas congue quisque egestas. Ac turpis egestas maecenas pharetra convallis posuere. Faucibus in ornare quam viverra orci. Fermentum leo vel orci porta non pulvinar neque. Tincidunt eget nullam non nisi. Sed euismod nisi porta lorem. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Purus viverra accumsan in nisl nisi scelerisque. Eget sit amet tellus cras adipiscing.";

export const AboutPage = () => {
    const classes = useStyles();
    return (
        <Container>
            <Paper elevation={0} className={classes.sidebarAboutBox}>
                <Typography variant="h2" gutterBottom align='center'>About</Typography>
                <Typography>
                    <p>{firstParagraph}</p>
                    <p>{secondParagraph}</p>
                </Typography>
            </Paper>
        </Container>
    );
}