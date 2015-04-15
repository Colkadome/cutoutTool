shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Cutout Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$link(rel="stylesheet", type = "text/css", href = "cutout.css"),
        tags$script(src="cutout.js")
    ),
    
    # title #
    #########
    
    h1("Cutout Tool"),
    
    # Main Content #
    ################
    
    sidebarLayout(
        sidebarPanel(
            h4("Ellipses"),
            tags$ul(id="ellipse_list",
                    tags$li(
                        tags$button(id="add_ellipse", type="button", class="btn btn-default",
                                    span(class="glyphicon glyphicon-plus", "Add")
                                    )
                        )
                    ),
            h4("Points"),
            tags$ul(id="point_list",
                    tags$li(
                        tags$button(id="add_point", type="button", class="btn btn-default",
                                    span(class="glyphicon glyphicon-plus", "Add")
                                    )
                        )
                    ),
            tags$button(id="save_items", type="button", class="btn btn-default",
                        span("Save Items")
                        )
        ),
        mainPanel(
            tags$canvas(id="canvas1",width=420,height=420),
            tags$button(id="zoom_in", type="button", class="btn btn-default",
                        span(class="glyphicon glyphicon-plus")
                        ),
            tags$button(id="zoom_out", type="button", class="btn btn-default",
                        span(class="glyphicon glyphicon-minus")
                        )
        )
    ),
    imageOutput(outputId="image1",width=420,height=420)
    
))