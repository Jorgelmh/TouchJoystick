/**
 * ===============================
 *        Joystick Class
 * ===============================
 * 
 * @constructor
 * 
 * @param canvas {Object} - HTML canvas element where the joystick will be drawn
 * @param position {Object} - X and Y positions to draw the joystick
 * @param radius {Integer} - Radius of the outter circle -> inner will be drawn based on this value (60% of outter)
 * @param internalFillColor {String} (optional) - Internal color of inner circle
 * @param internalStrokeColor {String} (optional) - Border color of inner circle
 * 
 */

class Joystick{
    constructor(canvas, position, radius, internalFillColor, internalStrokeColor){

        /* Drawing canvas */
        this.canvas = canvas
        this.context = canvas.getContext("2d")

        /* Stablishing dimensions */
        this.position = position
        this.radius = radius

        /* Outer circle */
        this.outterCircle = {
            x: this.position.x,
            y: this.position.y,
            radius: this.radius
        }

        /* Inner circle */
        this.innerCircle = {
            x: this.position.x,
            y: this.position.y,
            radius: this.radius * .60
        }

        /* Cos and sin */
        this.movement = {
            cos: 0,
            sin: 0
        }

        this.angle = 0

        /* Dragging */
        this.dragging = false

        /* Color and Design */
        this.internalFillColor = internalFillColor || "#00AA00"
        this.internalStrokeColor = internalStrokeColor || "#003300"

        this.drawJoystick()
    }

    drawJoystick(){

        /* Clear canvas before drawing */
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        /* Draw outer circle */
        this.context.beginPath()
        this.context.arc(this.outterCircle.x, this.outterCircle.y, this.outterCircle.radius, 0, Math.PI * 2)
        this.context.stroke()

        /* Draw inner circle */
        this.context.beginPath()
        this.context.arc(this.innerCircle.x, this.innerCircle.y, this.innerCircle.radius, 0, Math.PI * 2)

        /* Creating a gradient */
        let grd = this.context.createRadialGradient(this.innerCircle.x, this.innerCircle.y, 5, this.innerCircle.x, this.innerCircle.y, 200)
        grd.addColorStop(0, this.internalFillColor)
        grd.addColorStop(1, this.internalStrokeColor)

        /* Filling the circle */
        this.context.fillStyle = grd;
        this.context.fill()
        this.context.stroke()
    }

    /* Event listener to detect if the user is dragging */
    addListeners(){

        /* When clicked then starts draggin */
        this.canvas.addEventListener('mousedown', (e) => {

            /* Determine if user is clicking the inner circle -> implemented using pythagoras */
            if(Math.pow(e.pageX - this.innerCircle.x, 2) + Math.pow(e.pageY - this.innerCircle.y, 2) <= Math.pow(this.innerCircle.radius, 2))
                this.dragging = true
        })

        /* When released click then return to original position */
        this.canvas.addEventListener('mouseup', () => {
            this.dragging = false
            this.innerCircle.x = this.position.x
            this.innerCircle.y = this.position.y
            this.drawJoystick()
        })

        this.canvas.addEventListener('mousemove', (e) => {

            /* if clicked */
            if(this.dragging){
                let mx = e.pageX
                let my = e.pageY
                let angle = Math.atan((my - this.outterCircle.y)/(mx - this.outterCircle.x))

                /* Move freely while in the outer circle */
                if(Math.pow(mx - this.outterCircle.x, 2) + Math.pow(my - this.outterCircle.y, 2) <= Math.pow(this.outterCircle.radius, 2)){
                    this.innerCircle.x = mx
                    this.innerCircle.y = my
                } else {

                    /* When the cursor is outside outer function then predict the position of inner circle
                        using sin and cos */

                    let offsetX
                    let offsetY

                    if(mx < this.outterCircle.x){
                        offsetX = (this.outterCircle.x - (this.radius * Math.cos(angle))) - mx
                        this.innerCircle.x = mx + offsetX
                    }else{
                        offsetX = mx - (this.outterCircle.x + (this.radius * Math.cos(angle)))
                        this.innerCircle.x = mx - offsetX
                    }

                    if(my < this.outterCircle.y){
                        offsetY = (this.outterCircle.y - (this.radius * Math.sign(angle) *Math.sin(angle))) - my
                        this.innerCircle.y = my + offsetY
                    }else{
                        offsetY = my - (this.outterCircle.y + (this.radius * Math.sign(angle) * Math.sin(angle)))
                        this.innerCircle.y = my - offsetY
                    }

                }
                /* Compute the values of movement for characters */
                this.computeAngles(mx - this.outterCircle.x, this.outterCircle.y - my, angle)

                /* Redraw canvas => You might light to add this call to your original Render method */
                this.drawJoystick() 
            }
        })
    }

    /**
     *  @desc Compute value of character movement based on position of inner circle
     * 
     *  @param x - inner circle's X position with regards to outter circle => innerCircleX - outterCircleX
     *  @param y - inner circle's Y position with regards to outter circle => OutterCircleY - innerCircleY
     * 
     *  Note: As Y axis is inverted on a canvas, then we must substract from outterCircle
     * 
     *  @returns - Object with the value of movement on X and Y
     * */ 
    computeAngles(x, y, angle){

        let movement

        /* Calculate the proportion of the distance to be moved */
        let hypotenuse = Math.sqrt(Math.pow(this.outterCircle.x - this.innerCircle.x, 2) + Math.pow(this.innerCircle.y - this.outterCircle.y, 2))

        /* Get porcentage of movement regards to inner circle's radius */
        let proportionOfMovement = hypotenuse * 100 / this.outterCircle.radius

        if( x >= 0 ){
            if(y >= 0)
                movement = {cos: Math.cos(angle), sin: Math.sin(angle)}
            else
                movement = {cos: Math.cos(angle), sin: Math.sin(angle)}
        }else{
            if(y >= 0)  
                movement = {cos: -Math.cos(angle), sin: Math.sin(angle)}
            else
                movement = {cos: -Math.cos(angle), sin: -Math.sin(angle)}
        }

        /* apply proportion of movement */
        movement.cos *= proportionOfMovement/100
        movement.sin *= proportionOfMovement/100

        /* TESTING */
        console.log(`${movement.cos}, ${movement.sin}`);

        return movement    
    }
}