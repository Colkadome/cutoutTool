library(png)
library(base64enc)
library(FITSio)
library(astro)

shinyServer(function(input, output, session) {
    
    values = reactiveValues(img="testim/164451.png")
    
    # Sets the background image.
    # Should be reactive to the PNG string.
    observe({
        
        # read pixels (likely from somewhere!)
        pixels = readPNG(values$img)
        
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
            type = "custom_setImage",
            message = list("src"=uri)
        )
    })
    
    observe({
        input$test_button
        session$sendCustomMessage(
            type = "custom_setItems",
            message = list("ellipses"=list(list("x"=400, "y"=300, "radA"=153.4047, "radB"=40, "rot"=0.4519863)),
                           "points"=list()
            )
        )
    })
    
    observe({
        print(input$items)
    })
})