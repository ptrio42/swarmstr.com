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
import {Helmet} from "react-helmet";

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
      <Helmet>
         <title>Swarmstr.com - your knowledge hub for all kinds of minds!</title>
         <meta property="description" content={`What if Quora/StackOverflow knew who you followed on social media and used that to help scope what kind of questions and answers you saw? That's what Swarmstr does!`} />
         <meta property="keywords" content="swarmstr, q&a, find answers, quora on nostr, stackoverflow on nostr, nostr, nip05, nostr handle, nostr address" />

         <meta property="og:url" content={`${process.env.BASE_URL}/nostr-address`} />
         <meta property="og:type" content="website" />
         <meta property="og:title" content={`Swarmstr.com - your knowledge hub for all kinds of minds!`} />
         <meta property="og:description" content={`What if Quora/StackOverflow knew who you followed on social media and used that to help scope what kind of questions and answers you saw? That's what Swarmstr does!`} />
         <meta property="og:image" content={`${Config.APP_IMAGE}`} />

         <meta itemProp="name" content={`Swarmstr.com - your knowledge hub for all kinds of minds!`} />

         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@swarmstr" />
         <meta name="twitter:title" content={`Swarmstr.com - your knowledge hub for all kinds of minds!`} />
         <meta name="twitter:description" content={`What if Quora/StackOverflow knew who you followed on social media and used that to help scope what kind of questions and answers you saw? That's what Swarmstr does!`} />
         <meta name="twitter:image:src" content={`${Config.APP_IMAGE}`} />
         <meta itemProp="image" content={`${Config.APP_IMAGE}`} />

      </Helmet>
      <Box className="landingPage-box">
         <Typography variant="h5" component="div" sx={{ fontSize: '1.435rem!important' }}>
            { Config.SLOGAN }
         </Typography>

         <Box className="hiveContainer">
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
             to={`/e/nevent1qgsg8panfud0pcg5qcj4yvpu8aau4d7q4j7r2gez203zwp4s4c4jxncpz3mhxue69uhhztnnwashymtnw3ezucm0d5qzp8tqqmw80eudc3ppzfuz26z2ju3kt275aqaug6craleqmmwaljeucm070z`}
         >
            <Info /> &nbsp;Learn more about Swarmstr
         </Button>
      </Box>
   </React.Fragment>;
};