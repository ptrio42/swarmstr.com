import {useState, useEffect} from "react";
import * as React from "react";
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import './Carousel.css';
import {styled} from "@mui/material/styles";

interface SlidesProps {
    slides: any[]
}

const Slide = styled(Paper)(({ theme }) => ({
    boxShadow: 'none',
    background: 'transparent',
    border: 'none',
    borderRadius: '0px',
    ...theme.typography.body2
}));

export const Carousel = ({ slides }: SlidesProps) => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [onDragState, setOnDragState] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            handleNextSlide();
        }, 5000);
    }, [activeSlide]);

    const handleNextSlide = () => {
        if ((activeSlide + 1) > (slides.length - 1)) {
            setActiveSlide(0)
        } else {
            setActiveSlide(activeSlide + 1);
        }
    };

    const onDragStarted = (event: React.DragEvent) => {
        setOnDragState(event.clientX);
    };

    const onDragEnded = (event: React.DragEvent) => {
        handleNextSlide();
    };

    return (
        <Stack sx={{ width: '100%', overflow: 'hidden' }} direction="row">
            { slides.map((slide, index) => (
                <Slide
                    className={index === activeSlide ? 'active-slide' : 'inactive-slide'}
                    sx={{
                        width: '100%',
                        height: '100%',
                        flexShrink: '0',
                        transitionProperty: 'all',
                        transitionDuration: '1000ms',
                        transform: `translateX(-${index * 100}%)`
                    }}
                    key={index}
                    onDragStart={onDragStarted}
                    onDragEnd={onDragEnded}
                >
                    <img width="100%" alt={slide.title} src={slide.image} />
                </Slide>
            )) }
        </Stack>
    );
};