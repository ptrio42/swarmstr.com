import {Box} from "@mui/material";
import {Config} from "../../resources/Config";
import {Info} from "@mui/icons-material";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Metadata} from "../../components/Nostr/Metadata/Metadata";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import './Home.css';
import Divider from "@mui/material/Divider";
import {NoteTags} from "../../components/Nostr/NoteTags/NoteTags";
import {request} from "../../services/request";
import {RotatingText} from "../../components/RotatingText/RotatingText";
import {HtmlHead} from "../../components/Html/HtmlHead";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {containsTag, useManageSubs, valueFromTag} from "../../utils/utils";
import {LabelEvent} from "../../models/commons";
import {uniq, groupBy} from "lodash";
import {EventListWrapper} from "../../components/Nostr/EventListWrapper/EventListWrapper";
import EventList from "../../components/Nostr/EventList/EventList";
import NostrEventListContextProvider from "../../providers/NostrEventListContextProvider";
import {useNostrContext} from "../../providers/NostrContextProvider";
import {getEventsAsPromise, subscribe} from "../../services/nostr/relays";
import {EventStore} from "../../components/Nostr/EventStore/EventStore";
import {NostrEvent} from "nostr-tools";

export const Home = () => {
   const contributors = Config.CONTRIBUTORS;

   const [searches, setSearches] = useState<{ query: string, hits: number }[]>([]);

   const filter = {
      kinds: [1985],
      '#l': searches.slice(0, 5).map(({query}) => `search/${encodeURIComponent(query)}`).flat(1)
   };

   const {ndk} = useNostrContext();
   const { addSub } = useManageSubs({ndk, subscribe});

   const eventIds = useLiveQuery(
       async () => {
          if (!searches || searches.length === 0) return;
          const eventIds: string[] = [];
          // searches.slice(0, 5).forEach(async (query: string) => {
             const result = await db.labels
                 .where('labelName')
                 .anyOf(searches.slice(0, 5).map(({query}) => `search/${encodeURIComponent(query)}`))
                 .toArray();

             const grouped = groupBy(result, 'labelName');
             const sliced = Object.values(grouped)
                 .map((lbs: LabelEvent[]) => Object.keys(groupBy(lbs, 'referencedEventId')).slice(0, 3))
                 .flat(1);

             return sliced;

             // console.log('Home: ', {grouped})

          // return Object.keys(grouped);

             // return Object.values(grouped)
             //     .map((lbs: LabelEvent[]) => uniq(lbs.map((event: LabelEvent) => valueFromTag(event, 'e'))).slice(0, 4)).flat(2);
             //
             // console.log('Home: labels: ', result, {searches});
             // eventIds.push(...uniq(result.map((event: LabelEvent) => valueFromTag(event, 'e'))).slice(0, 4));
          // });

          // return ;
       }
   , [searches], []);

   const eventStore = EventStore({filter});

   // const events = useLiveQuery(async () => {
   //    console.log('Home: eventIds: ', eventIds)
   //    if (!eventIds || eventIds.length === 0) return;
   //    // @ts-ignore
   //    const events = await db.notes.where('id').anyOf(eventIds).toArray();
   //    return events;
   // }, [eventIds]);

   useEffect(() => {
      request({ url: `${process.env.BASE_URL}/popular-searches` })
          .then((response) => {
             setSearches(response.data);
             console.log({suggestions: response.data})
          });

      // addSub({
      //    kinds: [1985],
      //    '#l': [`search/${encodeURIComponent(searches[0].query)}`]
      // }, {closeOnEose: false});

   }, []);

   useEffect(() => {
      if (searches && searches.length > 0) {
         getEventsAsPromise(ndk, filter)
             .then((events: NostrEvent[]) => {
                eventStore.addEvents(events);
             })
      }
   }, [searches]);

   return <React.Fragment>
      <HtmlHead
          title={`Swarmstr.com - your knowledge hub for all kinds of minds!`}
          description={`What if Quora/StackOverflow knew who you followed on social media and used that to help scope what kind of questions and answers you saw? That's what Swarmstr does!`}
      />

      <Box className="landingPage-box">
         <Typography variant="h5" component="div" sx={{ fontSize: '1.435rem!important' }}>
            { Config.SLOGAN }
         </Typography>

         <Box>
            <Button
                sx={{ textTransform: 'capitalize' }}
                color="warning"
                variant="outlined"
                component={Link}
                to={`/e/nevent1qgsg8panfud0pcg5qcj4yvpu8aau4d7q4j7r2gez203zwp4s4c4jxncpz3mhxue69uhhztnnwashymtnw3ezucm0d5qzp8tqqmw80eudc3ppzfuz26z2ju3kt275aqaug6craleqmmwaljeucm070z`}
            >
               <Info /> &nbsp;Learn more
            </Button>
            <Button sx={{ textTransform: 'capitalize', marginLeft: '1em' }} variant="contained" color="secondary" component={Link} to="/d/nostr-faq">
               Nostr FAQ
            </Button>
         </Box>

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
               <h4>Popular searches</h4>
               <NoteTags path="search" explicitlyExpanded={true} styles={{ display: 'block' }} tags={searches.map((s: any) => [s.hits, s.query])}/>
            </Box>
         }

         <Box>
            {
               eventStore.getTotalCount() > 0 && <h4>Featured notes</h4>
            }
            <NostrEventListContextProvider eventStore={eventStore}>
               <EventListWrapper>
                  <EventList floating={false}/>
               </EventListWrapper>
            </NostrEventListContextProvider>
         </Box>

         {/*<Typography component="div" variant="body1">*/}
            {/*<h3>Have questions about Nostr?</h3>*/}
            {/*<Button className="nav-button" variant="contained" color="primary" component={Link} to="/d/nostr-faq">*/}
               {/*Check out our Nostr FAQ*/}
            {/*</Button>*/}
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
         {/*</Typography>*/}
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
         {/*<Divider sx={{ margin: '0.4em' }}/>*/}

      </Box>
   </React.Fragment>;
};