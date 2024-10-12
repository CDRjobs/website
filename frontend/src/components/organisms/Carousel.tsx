import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { Autoplay } from 'swiper/modules'

type CarouselProps = {
  slides: React.ReactNode[],
  slideWidth: number,
  slideHeight: number,
}

const Carousel = (props: CarouselProps) => {
  const breakpoints = Array(12).fill('').reduce((breaks, _, i) => {
    return ({
      ...breaks,
      [(i + 1) * (props.slideWidth)]: {
        slidesPerView: i + 1,
      },
    })
  }, {})

  if (props.slides.length === 0) {
    return <div className='my-2.5' style={{ height: `${props.slideHeight + 20}px` }}></div>
  }

  return (
    <Swiper
      style={{ padding: '10px 0' }}
      spaceBetween={30}
      slidesPerView={2}
      loop={true}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      breakpoints={breakpoints}
      breakpointsBase='container'
      speed={10000}
      modules={[Autoplay]}
      onSwiper={(swiper) => { swiper.wrapperEl.style.transitionTimingFunction = 'linear'}}
    >
      {props.slides.map((slide, i) => (
        <SwiperSlide key={`slide-${i}`}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Carousel

