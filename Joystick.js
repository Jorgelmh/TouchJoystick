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

        let canvasBoundingRect = this.canvas.getBoundingClientRect()

        this.offset = {
            x: canvasBoundingRect.x,
            y: canvasBoundingRect.y
        }

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
            x: 0,
            y: 0
        }

        /* Detect if mobile */
        window.mobileCheck = function() {
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        };

        this.angleInDegrees = 0

        /* Dragging */
        this.dragging = false

        /* Color and Design */
        this.internalFillColor = internalFillColor || "#00AA00"
        this.internalStrokeColor = internalStrokeColor || "#003300"

        this.addListeners()
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

        window.addEventListener('resize', () => {
            let canvasBoundingRect = this.canvas.getBoundingClientRect()

            let oldDimensions = {
                width: this.canvas.width,
                height: this.canvas.height
            }

            this.canvas.width = canvasBoundingRect.width
            this.canvas.height = canvasBoundingRect.height

            this.offset = {
                x: canvasBoundingRect.x,
                y: canvasBoundingRect.y
            }

            this.position.x = this.canvas.width * this.innerCircle.x / oldDimensions.width
            this.position.y = this.canvas.height * this.innerCircle.y / oldDimensions.height

            this.innerCircle.x = this.position.x
            this.innerCircle.y = this.position.y

            this.outterCircle.x = this.position.x
            this.outterCircle.y = this.position.y

            this.drawJoystick()

        })

        window.addEventListener('scroll', (e) => {
            let canvasBoundingRect = this.canvas.getBoundingClientRect()

            this.offset = {
                x: canvasBoundingRect.x,
                y: window.scrollY + parseInt(canvasBoundingRect.y)
            }

        })

        if(window.mobileCheck()){
            window.addEventListener('touchstart', this.handleStart)
            window.addEventListener('touchmove', this.handleMovement)
            window.addEventListener('touchend', this.handleReleased)
        }else{
            window.addEventListener('mousedown', this.handleStart)
            window.addEventListener('mouseup', this.handleReleased)
            window.addEventListener('mousemove', this.handleMovement)
        }  
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
    computeMovement(x, y, angle){

        let movement = {x: 0, y: 0}

        /* Calculate the proportion of the distance to be moved */
        let hypotenuse = Math.sqrt(Math.pow(this.outterCircle.x - this.innerCircle.x, 2) + Math.pow(this.innerCircle.y - this.outterCircle.y, 2))

        /* Get porcentage of movement regards to inner circle's radius */
        let proportionOfMovement = hypotenuse * 100 / this.outterCircle.radius

        let degreeAngle = angle * 180 / Math.PI

        if( x >= 0 ){
            if(y >= 0){
                movement = {x: Math.cos(angle), y: Math.sin(angle)}
                degreeAngle = -degreeAngle
            }
            else{
                movement = {x: Math.cos(angle), y: Math.sin(angle)}
                degreeAngle = 360 - degreeAngle
            }
        }else{
            if(y >= 0) {
                movement = {x: -Math.cos(angle), y: -Math.sin(angle)}
                degreeAngle = 180 - degreeAngle
            }
            else{
                movement = {x: -Math.cos(angle), y: -Math.sin(angle)}
                degreeAngle -= 180
                degreeAngle = -degreeAngle
            }
        }

        /* apply proportion of movement */
        movement.x *= proportionOfMovement/100
        movement.y *= proportionOfMovement/100

        /* TESTING */
        //console.log(`${x}, ${y}, ${degreeAngle}`);

        this.movement.x = movement.x
        this.movement.y = movement.y 
        this.angleInDegrees = degreeAngle
    }

    /**
     * ====================================
     *      Get state of the Joystick
     * ====================================
     */

    getPosition(){
        return { 
            movement: {
                x: this.movement.x.toFixed(3),
                y: this.movement.y.toFixed(3)
            },
            angle: this.angleInDegrees.toFixed(3)
        }
           
    }

    /** 
     * ===============================
     *      LISTENERS' CALLBACKS
     * ===============================
     * */ 

    handleStart = (e) => {
        /* Determine if user is clicking the inner circle -> implemented using pythagoras */
        let pos = (window.mobileCheck()) ? e.changedTouches[0] : e

        if(Math.pow(pos.pageX - (this.innerCircle.x + this.offset.x), 2) + Math.pow(pos.pageY - (this.innerCircle.y + this.offset.y), 2) <= Math.pow(this.innerCircle.radius, 2))
            this.dragging = true
    }

    /* When clicked then starts draggin */
    handleMovement = (e) => {

        /* if clicked */
        if(this.dragging){
            let source = (window.mobileCheck()) ? e.changedTouches[0] : e
            let mx = source.pageX
            let my = source.pageY

            let angle = Math.atan((my - (this.outterCircle.y + this.offset.y))/(mx - (this.outterCircle.x + this.offset.x)))

            /* Move freely while in the outer circle */
            if(Math.pow(mx - (this.outterCircle.x + this.offset.x), 2) + Math.pow(my - (this.outterCircle.y + this.offset.y), 2) <= Math.pow(this.outterCircle.radius, 2)){
                this.innerCircle.x = mx - this.offset.x
                this.innerCircle.y = my - this.offset.y
            } else {

                /* When the cursor is outside outer function then predict the position of inner circle
                    using sin and cos */

                let offsetX
                let offsetY

                if(mx < this.outterCircle.x + this.offset.x){
                    offsetX = ((this.outterCircle.x + this.offset.x) - (this.radius * Math.cos(angle))) - mx
                    this.innerCircle.x = (mx-this.offset.x) + offsetX
                }else{
                    offsetX = mx - ((this.outterCircle.x + this.offset.x) + (this.radius * Math.cos(angle)))
                    this.innerCircle.x = (mx - this.offset.x)- offsetX
                }

                if(my < this.outterCircle.y + this.offset.y){
                    offsetY = ((this.outterCircle.y + this.offset.y) - (this.radius * Math.sign(angle) *Math.sin(angle))) - my
                    this.innerCircle.y = (my - this.offset.y) + offsetY
                }else{
                    offsetY = my - ((this.outterCircle.y + this.offset.y) + (this.radius * Math.sign(angle) * Math.sin(angle)))
                    this.innerCircle.y = (my - this.offset.y) - offsetY
                }

            }
            /* Compute the values of movement for characters */
            this.computeMovement(mx - (this.outterCircle.x + this.offset.x), (this.outterCircle.y + this.offset.y) - my, angle)

            /* Redraw canvas => You might light to add this call to your original Render method */
            this.drawJoystick() 
        }
    }

    handleReleased = (e) => {
        /* When released click then return to original position */
        this.dragging = false
        this.innerCircle.x = this.position.x
        this.innerCircle.y = this.position.y
        this.movement = {x: 0, y: 0}
        this.angleInDegrees = 0
        this.drawJoystick()
    }
}