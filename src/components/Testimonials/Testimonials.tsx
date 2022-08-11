import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormatQuote from "@mui/icons-material/FormatQuote";
import './Testimonials.css';


export const Testimonials = () => {
  return (
      <Box className="testimonials">
          <Box sx={{ width: '80%', margin: '0px auto' }}>
              <Typography variant="h3" component="div" gutterBottom sx={{ marginTop: '3em', paddingTop: '0.5em' }}>
                  Testimonials
              </Typography>
              <Typography variant="body1" component="div" align="justify" gutterBottom sx={{ lineHeight: '2', fontSize: '18px' }}>
                  <Card sx={{ width: '80%', margin: '0px auto' }}>
                      <CardContent sx={{ padding: '1.5em' }}>
                          <FormatQuote />My pal went shopping to buy shorts but came back with two pairs, additional two pairs of trousers and four t-shirts.
                          When I found out about it, a voice started rumbling in my head. Perhaps it was the voice of Satoshi.
                          I asked him if he at least got some sats back for the unexpected purchase.
                          No - he replied - but the offer was practically a steal. I saved about 40%.
                          But did he? - I then asked myself, and the voice became louder.
                          That's when I realized it wasn't Satoshi speaking to me, but rather an urging need to shame him.
                          If only I could make him feel bad about what he just did...
                          Do something that would affect his emotions stronger than words...
                          And then, I found out about www.uselessshit.co
                          Now I carry with me at least a dozen of the useless-shit cards and whenever someone makes a dumb purchase, I am prepared!
                          <br />Thanks uselessshit.co!<FormatQuote />
                      </CardContent>
                  </Card>
              </Typography>
          </Box>
      </Box>
  );
};