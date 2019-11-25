class CircularSlider
{
    constructor(domElement)
    {
        this.container = domElement;
        this.section_a = 0;
        this.section_b = Math.PI; 
        this.radius_outer = 80;
        this.radius_inner = 70;
        this.canvas_width = 300;
        this.canvas_height = 300;

        this.segment_count = 7;
        this.draw_between_segment = true;

        this.canvas = document.createElement('canvas');
        this.canvas.onmousedown = (e)=>{this.onMouseDown(e)};
        this.canvas.onmousemove = (e)=>{this.onMouseMove(e)};
        this.canvas.onmouseup = (e)=>{this.onMouseUp(e)};
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;

        this.center_x = this.canvas_width * 0.5;
        this.center_y = this.canvas_height * 0.5;

        this.container.appendChild(this.canvas);

        this.init();
    }

    init()
    {
        this.render();
    }

    getMousePos(evt) {
        let rect = this.canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

    currentKnob = null;

    length(x1, y1, x2, y2)
    {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1- y2) * (y1 - y2));
    }

    knotDetect(x, y, knob_pos)
    {
        let knob_radius =  (this.radius_outer - this.radius_inner) * 0.5;
        let knob_x = this.center_x + (this.radius_outer + this.radius_inner) * 0.5 * Math.cos(knob_pos);
        let knob_y = this.center_y + (this.radius_outer + this.radius_inner) * 0.5 * Math.sin(knob_pos);

        return this.length(x, y, knob_x, knob_y) <= knob_radius;
    }

    normalize(_x, _y)
    {
        let len = this.length(_x, _y, 0, 0);
        return {
            x: _x/len,
            y: _y/len
        }
    }

    newKnotPos(mouseX, mouseY)
    {
        let newPos = this.normalize(mouseX - this.center_x, mouseY - this.center_y);
        let newKnobPos = 0;
        if(newPos.y < 0)
        {
            newKnobPos = Math.PI + Math.acos(-1 * newPos.x)
        }
        else
        {
            newKnobPos = Math.acos(newPos.x);
        }
        return newKnobPos;
    }

    currentX = 0;
    currentY = 0;
    offsetX = 0;
    offsetY = 0;

    onMouseDown(e)
    {
        let mousePos = this.getMousePos(e);

        // check press which knob
        // select knob b first
        if(this.knotDetect(mousePos.x, mousePos.y, this.section_b))
        {
            this.currentKnob = 2;
            
            this.currentX = mousePos.x;
            this.currentY = mousePos.y;
            
            let knob_x = this.center_x + (this.radius_outer + this.radius_inner) * 0.5 * Math.cos(this.section_b);
            let knob_y = this.center_y + (this.radius_outer + this.radius_inner) * 0.5 * Math.sin(this.section_b);

            this.offsetX = this.currentX - knob_x;
            this.offsetY = this.currentY - knob_y;

            console.log("press b");
        }
        else if(this.knotDetect(mousePos.x, mousePos.y, this.section_a))
        {
            this.currentKnob = 1;
            
            this.currentX = mousePos.x;
            this.currentY = mousePos.y;
            
            let knob_x = this.center_x + (this.radius_outer + this.radius_inner) * 0.5 * Math.cos(this.section_a);
            let knob_y = this.center_y + (this.radius_outer + this.radius_inner) * 0.5 * Math.sin(this.section_a);

            this.offsetX = this.currentX - knob_x;
            this.offsetY = this.currentY - knob_y;
        }

        console.log("down x:" + mousePos.x + " y:" + mousePos.y);
    }

    onMouseMove(e)
    {
        let mousePos = this.getMousePos(e);
        if(this.currentKnob == 2)
        {
            this.section_b = this.newKnotPos(mousePos.x - this.offsetX, mousePos.y - this.offsetY, this.section_b);
            this.render();

            this.currentX = mousePos.x;
            this.currentY = mousePos.y;
        }
        else if(this.currentKnob == 1)
        {
            this.section_a = this.newKnotPos(mousePos.x - this.offsetX, mousePos.y - this.offsetY, this.section_a);
            this.render();

            this.currentX = mousePos.x;
            this.currentY = mousePos.y;
        }
    }

    onMouseUp(e)
    {
        let mousePos = this.getMousePos(e);
        if(this.currentKnob == 2)
        {
            this.currentKnob = -1;            
        }
        else if(this.currentKnob == 1)
        {
            this.currentKnob = -1;            
        }
        console.log("up x:" + mousePos.x + " y:" + mousePos.y);
    }

    render()
    {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas_width, this.canvas_height);

        this.draw_circle(this.radius_outer, 0, 2 * Math.PI, "#74b9ff");
        
        this.draw_circle(this.radius_outer, this.section_a, this.section_b, "#00b894");

        this.draw_circle(this.radius_inner, 0, 2 * Math.PI, "#dfe6e9");

        this.draw_knob(this.section_a);
        this.draw_knob(this.section_b);

        // this.draw_knob_text(this.section_a);
        // this.draw_knob_text(this.section_b);

        this.draw_axis_segment();
    }

    draw_axis_segment()
    {
        if(this.segment_count <= 0)
        {
            return;
        }
        let segmentLength = 5;
        let deltaBetween = 2.0 * Math.PI / this.segment_count;
        for(let i = 0; i < this.segment_count; i++)
        {
            let pos = deltaBetween * i;
            let x_start = this.center_x + (this.radius_outer) * Math.cos(pos);
            let y_start = this.center_y + (this.radius_outer) * Math.sin(pos);
            let x_end = this.center_x + (this.radius_outer + segmentLength) * Math.cos(pos);
            let y_end = this.center_y + (this.radius_outer + segmentLength) * Math.sin(pos);

            var ctx = this.canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(x_start, y_start);
            ctx.lineTo(x_end, y_end);
            ctx.stroke();
            
            if(this.draw_between_segment)
            {
                ctx.save();
                
                let text_x = this.center_x + (this.radius_outer + segmentLength + 20) * Math.cos(pos + deltaBetween * 0.5);
                let text_y = this.center_y + (this.radius_outer + segmentLength + 20) * Math.sin(pos + deltaBetween * 0.5);

                ctx.translate(text_x, text_y);
                ctx.rotate(pos + deltaBetween * 0.5 + Math.PI/2);

                ctx.font = "12px Comic Sans MS";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.fillText("Wes", 0, 0);
                ctx.restore();
            }
        }
    }

    axisTextFunc = null;

    draw_knob_text(pos, text = null, textOffset = 20)
    {
        let align = "left";

        if((pos > 0.5 * Math.PI) && (pos < 1.5 * Math.PI))
        {
            align = "right";
        }

        let text_x = this.center_x + ((this.radius_outer + this.radius_inner) * 0.5 + textOffset) * Math.cos(pos);
        let text_y = this.center_y + ((this.radius_outer + this.radius_inner) * 0.5 + textOffset) * Math.sin(pos);

        let ctx = this.canvas.getContext("2d");
        ctx.font = "18px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.textAlign = align;
        ctx.fillText(text==null?pos:"Hello World", text_x, text_y);
    }

    draw_knob(pos)
    {
        let x = this.center_x + (this.radius_outer + this.radius_inner) * 0.5 * Math.cos(pos);
        let y = this.center_y + (this.radius_outer + this.radius_inner) * 0.5 * Math.sin(pos);

        let ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, (this.radius_outer - this.radius_inner) * 0.5, 0, Math.PI * 2.0);
        ctx.fillStyle = "#6c5ce7";
        ctx.fill();
    }

    draw_circle(radius, start, end, color)
    {
        let ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.center_x, this.center_y);
        ctx.arc(this.center_x, this.center_y, radius, start, end);
        ctx.lineTo(this.center_x, this.center_y);
        ctx.fillStyle = color;
        ctx.fill();
        // ctx.stroke();
    }
}