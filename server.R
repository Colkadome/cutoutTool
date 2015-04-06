library(png)
library(base64enc)
library(FITSio)
library(astro)

shinyServer(function(input, output, session) {
    
    values = reactiveValues(img="www/test2.png")
    
    # Sets the background image.
    # Should be reactive to the PNG string.
    setBackground = observe({
        
        # read pixels (likely from somewhere!)
        pixels = readPNG("www/test2.png")
        
        # write to temporary file
        outfile = tempfile(fileext = ".png")
        writePNG(pixels, target = outfile)
        
        # get uri string from file
        uri = dataURI(
            file=outfile,
            mime="image/png")
        # URI CORRUPT??
        
        # delete temporary file
        unlink(outfile)

        # send uri to javascript canvas (SEND WIDTH AND HEIGHT DATA TOO)
        session$sendCustomMessage(
            type = "setImage",
            message = uri
        )
    })
    
    getOvals = function() {
        
    }
})