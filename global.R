## AARON's CODE ##
library(png)
library(base64enc)
library(FITSio)
library(astro)
library(data.table)
#lib="/home/arobotham/R/x86_64-unknown-linux-gnu-library/3.0/"
#library(png,lib=lib)
#library(base64enc,lib=lib)
#library(FITSio,lib=lib)
#library(astro,lib=lib)
#library(data.table,lib=lib)

#mainpath="/home/arobotham/testim/"
mainpath="/Users/aaron/Dropbox (GAMA)/ICRAR/Aaron/apimages/testim/"
tabscale=read.table(paste(mainpath,"imcoords.dat",sep=""),header = TRUE)
Apv05=read.csv('Data/Apv05.csv',header=TRUE)
##################