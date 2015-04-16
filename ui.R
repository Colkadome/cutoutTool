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
            tags$button(id="add_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(id="remove_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="ellipse_list"),
            h4("Points"),
            tags$button(id="add_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(id="remove_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="point_list"),
            tags$button(id="save_items", type="button", class="btn btn-default",span("Save Items")),
            h4("Colors"),
            tags$input(type="text", value="#FF0000", " Ellipses"),
            tags$input(type="text", value="#FF0000", " Points")
        ),
        mainPanel(
            tags$canvas(id="canvas1",width=420,height=420),
            tags$button(id="zoom_in", type="button", class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(id="zoom_out", type="button", class="btn btn-default",span(class="glyphicon glyphicon-minus"))
        )
    ),
    imageOutput(outputId="image1",width=420,height=420)
    
))