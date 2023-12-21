// resizing: https://jslegenddev.substack.com/p/how-to-make-your-canvas-scale-to
// countdown: https://thecodingtrain.com/challenges/66-javascript-countdown-timer

let base_width, base_height;
let aspect_ratio;
let scale_factor;
let canvas;
let interval;

// exercises
let exercises = [];

const states = {
  waiting: 0,
  prestart: 1,
  start: 2,
  rest: 3,
};
let state;

let start_time;
let current_time;
let time_left;
let current_exercise, total_exercises;

let text_size;

function convertToSeconds(s) {
  let m = floor(s / 60);
  let sec = s % 60;
  return nf(m, 2) + ":" + nf(sec, 2);
}

function preload() {
  let f;
  // turn into json later?
  f = loadImage(`img/abdominal-bracing.small.png`);
  exercises.push({
    img: f,
    timer: 15,
    name: "Abdominal bracing",
    type: "Strengthening",
    repetitions: 5,
  });

  f = loadImage(`img/side-bridges.small.png`);
  exercises.push({
    img: f,
    timer: 300,
    name: "Side bridges",
    type: "Strengthening",
    repetitions: 5,
  });

  f = loadImage(`img/bird-dog.small.png`);
  exercises.push({
    img: f,
    timer: 300,
    name: "Bird dog",
    type: "Strengthening",
    repetitions: 5,
  });

  f = loadImage(`img/cat-back.small.png`);
  exercises.push({
    img: f,
    timer: 60,
    name: "Cat back",
    type: "Stretching",
    repetitions: 5,
  });

  f = loadImage(`img/low-back-extension-and-flexion.small.png`);
  exercises.push({
    img: f,
    timer: 15,
    name: "Low back extension and flexion",
    type: "Stretching",
    repetitions: 5,
  });

  f = loadImage(`img/seat-side-straddle.small.png`);
  exercises.push({
    img: f,
    timer: 120,
    name: "Seat side straddle",
    type: "Stretching",
    repetitions: 5,
  });

  f = loadImage(`img/modified-seat-straddle.small.png`);
  exercises.push({
    img: f,
    timer: 120,
    name: "Modified seat side straddle",
    type: "Stretching",
    repetitions: 5,
  });

  f = loadImage(`img/sitting-rotation-stretch.small.png`);
  exercises.push({
    img: f,
    timer: 120 ,
    name: "Sitting rotation",
    type: "Stretching",
    repetitions: 5,
  });

  f = loadImage(`img/leg-crossover.small.png`);
  exercises.push({
    img: f,
    timer: 15,
    name: "Leg crossover",
    type: "Stretching",
    repetitions: 5,
  });
}

function setup() {
  base_width = 800;
  base_height = 600;

  aspect_ratio = base_width / base_height;

  fullscreen()
  
  const { canvasWidth, canvasHeight } = updateCanvas();
  canvas = createCanvas(canvasWidth, canvasHeight);

  scale_factor = base_width / canvasWidth;

  const cx = (windowWidth - canvasWidth) / 2;
  const cy = (windowHeight - canvasHeight) / 2;
  canvas.position(cx, cy);

  pixelDensity(window.devicePixelRatio);
  strokeWeight(2 * scale_factor);

  state = states.waiting;
  current_exercise = 0;

  textSize(64 * scale_factor);
  textAlign(CENTER, CENTER);

  noStroke();

  for (let e of exercises) {
    total_exercises += e.repetitions;

    e.current_repetition = 0;

    // e.repetitions = 2;
    // e.timer = 5;
  }

  imageMode(CENTER);
}

function draw() {
  background(220);

  let y = 10;
  let x = 10;
  let small_text = 32 * scale_factor;

  fill(color(10, 255, 10));
  rect(
    0,
    current_exercise * small_text + small_text / (3 * scale_factor),
    10 * scale_factor,
    small_text
  );
  textAlign(LEFT, TOP);
  textSize(small_text);
  fill(color(20));
  for (let e of exercises) {
    text(`[${e.current_repetition}/${e.repetitions}] ${e.name}`, x, y);
    y += small_text;
  }

  textAlign(CENTER, CENTER);
  textSize(64 * scale_factor);
  switch (state) {
    case states.waiting:
      text("PRESS MOUSE TO START", width / 2, height / 2);
      // text(`${round(millis() / 1000)} seconds have gone by!`, 20, height / 2);
      break;
    case states.prestart:
      image(
        exercises[current_exercise].img,
        width - exercises[current_exercise].img.width / 2,
        height - exercises[current_exercise].img.height / 2
      );

      text(
        `GET READY: ${convertToSeconds(time_left - current_time)}`,
        width / 2,
        height / 2
      );
      break;
    case states.start:
      image(
        exercises[current_exercise].img,
        width - exercises[current_exercise].img.width / 2,
        height - exercises[current_exercise].img.height / 2
      );
      
      text(
        `GO: ${convertToSeconds(time_left - current_time)}`,
        width / 2,
        height / 2
      );
      // rect(0, 0, 10, 10);
      break;
    case states.rest:
      // rect(20, 20, 10, 10);
      image(
        exercises[current_exercise].img,
        width - exercises[current_exercise].img.width / 2,
        height - exercises[current_exercise].img.height / 2
      );
      text(
        `REST: ${convertToSeconds(time_left - current_time)}`,
        width / 2,
        height / 2
      );
      break;
    default:
      break;
  }

  // text(`${round(millis() / 1000)} seconds have gone by!`, 20, height / 2);
  // rect(50*scale_factor,50*scale_factor,16*scale_factor,16*scale_factor);
}

function mousePressed() {
  if (state == states.waiting) {
    state = states.prestart;
    resetTimer(5);
  }
}

function resetTimer(tl) {
  start_time = millis();
  current_time = floor((millis() - start_time) / 1000);
  time_left = tl;
  interval = setInterval(timeIt, 1000);
}

function timeIt() {
  current_time = floor((millis() - start_time) / 1000);
  // stroke(20);
  // console.log(
  //   time_left,
  //   current_time,
  //   convertToSeconds(time_left - current_time)
  // );

  if (current_time == time_left) {
    // console.log("TIME OUT");
    clearInterval(interval);

    switch (state) {
      case states.prestart:
        state = states.start;
        exercises[current_exercise].current_repetition++;
        resetTimer(exercises[current_exercise].timer);
        break;
      case states.start:
        state = states.rest;

        current_exercise++;
        if (current_exercise > exercises.length - 1) {
          current_exercise = 0;

          let done = false;
          for (let e of exercises) {
            if (e.current_repetition >= e.repetitions) {
              done = true;
              break;
            }
          }

          if (done) setup(); //state = states.waiting;
        }
        resetTimer(5);
        break;
      case states.rest:
        state = states.start;
        exercises[current_exercise].current_repetition++;
        resetTimer(exercises[current_exercise].timer);
        break;
    }
    //     if (state == states.prestart) {
    //       state = states.start;
    //       time_left = exercises[current_exercise].timer;
    //       current_time = floor((millis() - start_time) / 1000);
    //       interval = setInterval(timeIt, 1000);
    //     } else if (state == states.start) {
    //       current_exercise++;
    //       if (current_exercise > exercises.length - 1) {
    //         state = states.waiting;
    //       } else {
    //         state = states.rest;
    //         current_time = floor((millis() - start_time) / 1000);
    //         time_left = 5;
    //         interval = setInterval(timeIt, 1000);
    //       }
    //       interval = setInterval(timeIt, 1000);
    //     } else if (state == states.rest) {
    //       state = states.start;

    //       current_time = floor((millis() - start_time) / 1000);
    //       time_left = exercises[current_exercise].timer;
    //       interval = setInterval(timeIt, 1000);
    //     } else state = states.waiting;
  }
}

function windowResized() {
  setup();
}

function updateCanvas() {
  if (windowWidth / windowHeight > aspect_ratio)
    return {
      canvasWidth: windowHeight * aspect_ratio,
      canvasHeight: windowHeight,
    };
  return {
    canvasWidth: windowWidth,
    canvasHeight: windowWidth / aspect_ratio,
  };
}
