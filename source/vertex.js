const vertexShaderSrc = `      
        attribute vec3 aPosition;
        uniform mat4 uModelTransformMatrix;
        attribute vec3 aColor;
        varying vec3 vColor;  
        void main () {             
          gl_Position = uModelTransformMatrix * vec4(aPosition, 1.0); 
          gl_PointSize = 5.0;   
          vColor = aColor;  
        }                          
	  `;

export default vertexShaderSrc;
