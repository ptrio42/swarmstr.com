import {Box} from "@mui/material";
import {Config} from "../../../resources/Config";
import {Info} from "@mui/icons-material";
import {Link} from "react-router-dom";
import React from "react";
import {Metadata} from "../Metadata/Metadata";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import './Home.css';
import Divider from "@mui/material/Divider";

export const Home = () => {
   const contributors = Config.CONTRIBUTORS;

   return <React.Fragment>
      <Box className="landingPage-box">
         <Typography variant="h5" component="div">
            { Config.SLOGAN }
            {/*<Tooltip title="Learn more about Swarmstr">*/}
            {/*</Tooltip>*/}
         </Typography>
         <Typography component="div" variant="body1">
            <Button className="nav-button" variant="contained" color="primary" component={Link} to="/search">
               Search
            </Button>
            <Button
                className="nav-button"
                variant="text"
                color="secondary"
                component={Link}
                to="/recent"
            >
               Recent questions
            </Button>
         </Typography>
         <Typography sx={{ marginBottom: '1em', marginTop: '1em' }} component="div" variant="h5">
            Contributors
            <Tooltip title={`People that contributed to Swarmstr development.`}>
               <IconButton className="contributors-button">
                  <Info />
               </IconButton>
            </Tooltip>
         </Typography>
         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {
               contributors && <React.Fragment>
                  {
                     contributors.map((pubkey: string) => (
                         <Metadata variant={'avatar'} pubkey={pubkey} />
                     ))
                  }
               </React.Fragment>
            }
         </Box>
         <Divider sx={{ margin: '0.4em' }}/>
         <Button
             className="aboutSwarmstr-button"
             color="secondary"
             component={Link}
             to={`${process.env.BASE_URL}/e/nevent1qqsyuhzx9h787y6kxc5m7qehqdzhrwnx0ztzcua9e9s878ug73hf6uqpz3mhxue69uhhyetvv9ujuerpd46hxtnfdulvpefd`}
         >
            <Info /> Learn more about Swarmstr
         </Button>
      </Box>
   </React.Fragment>;
};