import {Box} from "@mui/material";
import {Config} from "../../../resources/Config";
import {Info} from "@mui/icons-material";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Metadata} from "../Metadata/Metadata";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import './Home.css';
import Divider from "@mui/material/Divider";
import {NoteTags} from "../NoteTags/NoteTags";
import {request} from "../../../services/request";
import {RotatingText} from "../../RotatingText/RotatingText";

export const Home = () => {
   const contributors = Config.CONTRIBUTORS;

   const [searches, setSearches] = useState([]);

   useEffect(() => {
      request({ url: `${process.env.BASE_URL}/popular-searches` })
          .then((response) => {
             setSearches(response.data);
             console.log({suggestions: response.data})
          })

   }, []);

   return <React.Fragment>
      <Box className="landingPage-box">
         <Typography variant="h5" component="div" sx={{ fontSize: '1.435rem!important' }}>
            { Config.SLOGAN }
         </Typography>

         <Box sx={{ position: 'relative', height: '236px' }}>
            <div className={"star"}></div>
            <Box sx={{ position: 'relative',
               width: '300px',
               height: '121px',
               margin: 'auto',
               transform: 'translateY(100px)',
               zIndex: 999 }}>
               <img className="hiveQueen" width="23%" src={`${process.env.BASE_URL}/images/swarmstr.png`} alt={Config.SLOGAN}/>
               <img className="hornets" id="hornet1" src={`${process.env.BASE_URL}/images/swarmstr-hornet.png`} width="16px"/>
               <img className="hornets" id="hornet2" src={`${process.env.BASE_URL}/images/swarmstr-hornet.png`} width="16px"/>
               <img className="hornets" id="hornet3" src={`${process.env.BASE_URL}/images/swarmstr-hornet.png`} width="16px"/>
               <img className="hornets" id="hornet4" src={`${process.env.BASE_URL}/images/swarmstr-hornet.png`} width="16px"/>
            </Box>
            <img className={"nostrnaut"} width="33%" src={`${process.env.BASE_URL}/images/hexagons.png`} alt={Config.SLOGAN}/>
         </Box>
         <Box>
            <RotatingText/>
         </Box>

         {/*<Box>*/}
            {/*Our main focus is content discoverability.<br/>*/}
            {/*Swarmstr indexes notes across popular categories and makes them searchable.<br/>*/}
         {/*</Box>*/}

         {/*<Box>*/}
            {/*100% of content on Swarmstr comes from Nostr users.*/}
         {/*</Box>*/}

         {/*<Box>*/}
            {/*For content creators we offer built-in tools like markdown editor, image creator and more.*/}
         {/*</Box>*/}

         <Box>
            {/*<h6>Discover content</h6>*/}
            <NoteTags explicitlyExpanded={true} styles={{ display: 'block' }} tags={Config.NOSTR_TAGS.map((t: string) => ['t', t])}/>
         </Box>

         {
            searches.length > 0 && <Box>
               <h6>Popular searches</h6>
               <NoteTags path="search" explicitlyExpanded={true} styles={{ display: 'block' }} tags={searches.map((s: any) => [s.hits, s.query])}/>
            </Box>
         }
         <Typography component="div" variant="body1">
            <h3>Have questions about Nostr?</h3>
            <Button className="nav-button" variant="contained" color="primary" component={Link} to="/d/nostr-faq">
               Check out our Nostr FAQ
            </Button>
            {/*<Button*/}
                {/*sx={{ border: '1px solid' }}*/}
                {/*className="nav-button"*/}
                {/*variant="text"*/}
                {/*color="secondary"*/}
                {/*component={Link}*/}
                {/*to="/recent"*/}
            {/*>*/}
               {/*Recent questions*/}
            {/*</Button>*/}
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
             to={`/e/nevent1qqsyuhzx9h787y6kxc5m7qehqdzhrwnx0ztzcua9e9s878ug73hf6uqpz3mhxue69uhhyetvv9ujuerpd46hxtnfdulvpefd`}
         >
            <Info /> &nbsp;Learn more about Swarmstr
         </Button>
      </Box>
   </React.Fragment>;
};