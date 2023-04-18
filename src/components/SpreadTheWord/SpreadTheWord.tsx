import React from 'react';
import {Button, Typography} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Bolt, CurrencyBitcoin} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Campaign from '@mui/icons-material/Campaign';
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";

export const SpreadTheWord = () => {
    return (
      <Box sx={{ marginTop: '1em'  }}>
          <Campaign sx={{ fontSize: '80px' }} />
          <Typography id="spread-the-word" variant="h3" component="div" gutterBottom>
              Spread the word!
          </Typography>
          <Typography
              variant="body1"
              component="div"
              align="justify"
              gutterBottom
              sx={{ lineHeight: '2', fontSize: '18px' }}
          >
              Information can proliferate just like a virus.
              Thanks to communications technologies, all it takes is one tweet or a post and boom!
              - someone (or even thousands of people) on the other side of the globe now knows a bit more about something.
              However, with so much stuff being communicated each and every single day,
              there’s always a possibility that the information that was shared will  never be seen anyone (especially if your account on Twitter has like 10 followers).
              On the other hand, in the physical realm, when information is exchanged,
              you can be almost certain that the person in front of you is receiving the content you’re transmitting
              - unless of course they aren’t paying attention.
              <br/><br/>
              Spread the good vibes and encourage people into learning about bitcoin and the importance of sats stacking.
              If you're a Bitcoiner you're most likely doing so anyways! But here's another tool for ya.
              <br/><br/>
              Onboard people into the future by handing them these cards (links below) and let the peaceful revolution continue.
              <br/><br/>
              The cards are 3.5 inches by 2 inches (business card size), so you can easily carry a bunch of them in your wallet
              and hand them out to peeps when needed.
              <br/><br/>

              All linked cards are in print-friendly PDF files. Translations and other variations are most welcomed!
          </Typography>
          <List sx={{ marginBottom: '3em' }}>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/new-uselessshit-card-front.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Card Front" />
                  </a>
              </ListItem>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/new-uselessshit-card-back.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Card Back" />
                  </a>
              </ListItem>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/uselessshit-card-front-1.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Card Front #1" />
                  </a>
              </ListItem>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/uselessshit-card-back-1.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Card Back #1" />
                  </a>
              </ListItem>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/uselessshit-card-back-2.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Card Back #2" />
                  </a>
              </ListItem>
          </List>
          <Accordion sx={{ marginBottom: '3em' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="card-sources-content" id="card-sources-header">
                  Sources
              </AccordionSummary>
              <AccordionDetails>
                  <Typography
                      variant="body1"
                      component="div"
                      align="justify"
                      gutterBottom
                      sx={{ lineHeight: '2', fontSize: '18px' }}
                  >
                      <List>
                          <ListItem>
                              <Bolt />
                              <a className="link" href={'../sources/uselessshit-card-front-1.xcf'} target="_blank">
                                  <ListItemText primary="uselessshit-card-front-1.xcf" />
                              </a>
                          </ListItem>
                          <ListItem>
                              <Bolt />
                              <a className="link" href={'../sources/uselessshit-card-back-1.xcf'} target="_blank">
                                  <ListItemText primary="uselessshit-card-back-1.xcf" />
                              </a>
                          </ListItem>
                      </List>
                  </Typography>
              </AccordionDetails>
          </Accordion>
          {/*<Typography variant="h4" component="div" gutterBottom>*/}
              {/*Create your own card*/}
          {/*</Typography>*/}
          {/*<Typography*/}
              {/*variant="body1"*/}
              {/*component="div"*/}
              {/*align="justify"*/}
              {/*gutterBottom*/}
              {/*sx={{ lineHeight: '2', fontSize: '18px', marginBottom: '3em' }}*/}
          {/*>*/}
              {/*If you're feeling creative <Button*/}
              {/*component={Link}*/}
              {/*to="/card-generator"*/}
              {/*color="secondary"*/}
          {/*>*/}
              {/*check our card generator*/}
          {/*</Button> and create your own personalized card, which you can then download, print & hand to your friends, family or haters. For now the cards are pretty basic, with a single image and text.*/}
          {/*</Typography>*/}

          <Typography variant="h4" component="div" gutterBottom>
              Spicing things up a bit
          </Typography>
          <Typography
              variant="body1"
              component="div"
              align="justify"
              gutterBottom
              sx={{ lineHeight: '2', fontSize: '18px' }}
          >
              Do you get irritated whenever someone close to you buys a bunch of shit they don't need?
              Are you immediately converting the amount of fiat they spent to precious sats which they would've gotten?
              Handing them the regular cards didn’t work as expected?
              Try shaming your buddies with the Useless Shit Shame cards!
              Perhaps this way, they'll put some effort into understanding the importance of saving in bitcoin!
          </Typography>
          <List sx={{ marginBottom: '3em' }}>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/en-uselessshit-card-front.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Useless Shit Card Front" />
                  </a>
              </ListItem>
              <ListItem>
                  <Bolt />
                  <a className="link" href={'../pdfs/en-uselessshit-card-back.pdf'} target="_blank">
                      <ListItemText primary="[ENG] Useless Shit Card Back" />
                  </a>
              </ListItem>
          </List>
      </Box>
    );
};