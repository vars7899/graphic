// add event listener to the complete html file and only fire the code after load is done
window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; // canvas will cover complete page
    canvas.height = window.innerHeight;

    // we can get the mid of the canvas by diving the canvas width and height by 2
    let mid = {
        height : canvas.height/2,
        width : canvas.width/2,
    }

    // ! canvas setting
    // by default the fill color of the shape created in canvas is set to #000, we can change it using the fillStyle prop 
    // ctx.fillStyle = 'purple';
    // ctx.strokeStyle = 'yellow'; // change the color of line(path)
    // ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffSetX = 10;
    ctx.shadowOffSetY = 5;
    ctx.shadowBlur = 10;

    // ! effect settings
    let size = canvas.width < canvas.height ? canvas.width*0.3 : canvas.height*0.3;
    let sides = 6;
    let spread = 0.8;
    const maxLevel = 5;
    const branches = 2;
    let scale = 0.6;
    let color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)'
    let lineWidth = Math.random()*15 + 5;
    let leftBranchBool = true;
    let rightBranchBool = true;
    let translateY = 0;
    let space = 0;

    // ! controls
    const randomizeButton = document.getElementById('randomizeButton');
    const slider_spread = document.getElementById('spread');
    const slider_sides = document.getElementById('sides');
    const label_spread = document.querySelector('[for="spread"]');
    const label_sides = document.querySelector('[for="sides"]');
    const resetButton = document.getElementById('reset');
    const leftBranch = document.getElementById('left_branch');
    const rightBranch = document.getElementById('right_branch');
    const slider_break = document.getElementById('break');
    const label_break = document.querySelector('[for="break"]');
    const slider_space = document.getElementById('space');
    const label_space = document.querySelector('[for="space"]');

    const updateSliders = () => {
        slider_spread.value = spread;
        slider_sides.value = sides;
        slider_break.value = translateY;
        slider_space.value = space;
        label_spread.innerText = 'Spread: ' + Number(spread).toFixed(1);
        label_sides.innerText = 'Sides: ' + sides;
        label_break.innerText = 'Break: ' + translateY;
        label_space.innerText = 'Space: ' + space;
    }
    slider_spread.addEventListener('change', function(e){
        spread = e.target.value;
        drawFractal();
    })
    slider_sides.addEventListener('change', function(e){
        sides = e.target.value;
        drawFractal();
    })
    leftBranch.addEventListener('change', function(e){
        leftBranchBool = !leftBranchBool;
        drawFractal();
    })
    rightBranch.addEventListener('change', function(e){
        rightBranchBool = !rightBranchBool;
        drawFractal();
    })
    slider_break.addEventListener('change', function(e){
        translateY = e.target.value;
        drawFractal();
    })
    slider_space.addEventListener('change', function(e){
        space = e.target.value;
        drawFractal();
    })
    // ctx.save();
    // ctx.translate(mid.width,mid.height); // translate change the rotation center point
    // ctx.scale(1,1); // to scale things in canvas
    // ctx.rotate(0); // rotate prop to rotate the canvas, by default the rotation origin is set to 0,0, we can change it using translate prop
    // ? Things to remember with the translate, scale and the rotate prop of the canvas is if we write
    // ? ctx.rotate(0.3);
    // ? ctx.rotate(0.8);
    // ? the ctx will rotate by 1.1, here not like css we are not overriding the previous rotate, the values always adds up.

    // ? The influence area of the prop can be adjusted using .save() and .restore() function.
    // fillRect --> creates a rectangle a given co-ordinates using given height and width of the rectangle
    // ctx.fillRect(0,0,canvas.width, canvas.height); // rectangle is getting the change but not the line
    
    
    // ctx.beginPath(); // beginPath --> creates a line(path)
    // ctx.moveTo(0,0); //starting point of the line
    // ctx.lineTo(size,0); //line till this co-ordinates
    // ctx.stroke();
    // ctx.rotate(0.5);


    // drawBranch fn --> creates each branch
    const drawBranch = (level) =>{
        // base case
        if(level >= maxLevel) return;
        
        // create line
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(size - space,0);
        ctx.stroke();

        // to create multi-branch
        for(let i=0; i<branches; i++){
            ctx.save();
            ctx.translate(size - (size/branches) * i, translateY);
            ctx.scale(scale, scale);
            
            if(rightBranchBool == true){
                ctx.save();
                ctx.rotate(spread);
                drawBranch(level+1) // recursion
                ctx.restore();
            }

            if(leftBranchBool == true){
                ctx.save();
                ctx.rotate(-spread);
                drawBranch(level+1) // recursion
                ctx.restore();
            }
            ctx.restore();

        
        }
        ctx.beginPath();
        ctx.arc(-size,size,size*0.05,0,Math.PI)
        ctx.fill();
    }

    // drawFractal fn --> to create a tree with multiple branch
    const drawFractal = () => {
        // delete previous fractal before creating new
        ctx.clearRect(0,0, canvas.width, canvas.height);

        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.translate(mid.width, mid.height);
        for(let i=0; i<sides; i++){
            ctx.rotate((Math.PI*2)/sides);
            drawBranch(0);
        }
        ctx.restore();
        updateSliders();
    }
    drawFractal();

    const randomize = () =>{
        lineWidth = Math.random()*20 + 10;
        sides = Math.floor((Math.random()*7) + 2); //random number between 0 and 9
        spread = (Math.random()*2.9) + 0.1; //random number between 0.2 to 0.4
        scale = (Math.random()*0.4) + 0.4;
        color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)'
    }

    randomizeButton.addEventListener('click', function(){
        randomize();
        drawFractal();
    });

    const reset = () =>{
        lineWidth = 10;
        sides = 6;
        spread = 0.8;
        scale = 0.6;
        color = 'hsl(100, 100%, 50%)'
        translateY = 0;
        space = 0;
    }

    resetButton.addEventListener('click', function(){
        reset();
        drawFractal();
    });

    // creates lines with given sides
    // for(let i=0; i<sides; i++){
    //     ctx.beginPath();
    //     ctx.moveTo(0,0);
    //     ctx.lineTo(size, 0);
    //     ctx.stroke();
    //     ctx.rotate((Math.PI * 2) / sides);
    //     ctx.scale(0.61, 0.99);
    // }
    window.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width*0.3 : canvas.height*0.3;
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowOffSetX = 10;
        ctx.shadowOffSetY = 5;
        ctx.shadowBlur = 10;
        drawFractal();
    });
})