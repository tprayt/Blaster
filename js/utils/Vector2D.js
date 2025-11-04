// 2D Vector class for position and velocity calculations
export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Add another vector to this vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    // Subtract another vector from this vector
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    // Multiply by a scalar
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Divide by a scalar
    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    // Get the magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize the vector (make it length 1)
    normalize() {
        const mag = this.magnitude();
        if (mag !== 0) {
            this.divide(mag);
        }
        return this;
    }

    // Limit the magnitude of the vector
    limit(max) {
        const mag = this.magnitude();
        if (mag > max) {
            this.normalize();
            this.multiply(max);
        }
        return this;
    }

    // Get the distance to another vector
    distanceTo(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Create a copy of this vector
    copy() {
        return new Vector2D(this.x, this.y);
    }

    // Set the vector values
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    // Static method to create a vector from an angle
    static fromAngle(angle, magnitude = 1) {
        return new Vector2D(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude
        );
    }
}
