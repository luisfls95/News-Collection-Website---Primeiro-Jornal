import requests
import bs4
import cloudscraper

def getAllFields(news_id):
    # esta função serve para receber o conteudo html de uma pagina e criar um objeto com 4 propriedades:
    # corpo do da noticia, titulo da noticia, descrição e imagem
    # o objeto deverá ter as mesmas propriedades tanto para o publico, observador ou eco

    publication_url = 'https://www.publico.pt/' + str(news_id)
    html = requests.get(publication_url)

    #esta conversão de string html permite que possam ser efetuadas procuras por ids, classes, etc
    soup = bs4.BeautifulSoup(html.text, 'html.parser')
    #print(soup)

    body = getNewsBody(soup, publication_url)
    title = getTitle(soup)
    desc = getDescritpion(soup)
    img = getMainPic(soup)

    json_to_send = {'content': body, 'title': title, 'desc': desc, 'img': img}

    print(json_to_send)

    return json_to_send

def getNewsBody(soup, link):
    #check se é exclusivo
    if soup.find('div', {'class': 'kicker kicker--exclusive'}) == None:
        exclusivo = False
    else:
        exclusivo = True


    # selecionar a div com o id 'story-body'
    story_body = soup.find('div', {'id': 'story-body'})
    # substituir todos os elementos <a> pelos seus conteudos
    for match in story_body.findAll('a'):
        match.replaceWithChildren()

    #criar um array com todos os elementos <p> e <h2> presentes no div 'story-body'
    content_array = story_body.findAll(('p', 'h2'))

    array_to_export = []
    for elem in content_array:
        # criar objetos com duas propriedades, o type que pode ser 'h2', ou 'p'
        # e o conteudo, uma string
        array_to_export.append({'type': elem.name, 'content': elem.text})

    if exclusivo:
        array_to_export.append({'type': 'p', 'content': 'Poderá consultar o artigo completo no website do <a href="' + link + '">Publico</a>'})

    return array_to_export

def fetch_custom(link):
    # esta pequena função permite evitar erros CORS
    # fazendo assim com que a nossa API não use diretamente os dados recebidos não despoletando o erro
    # e permitindo à nossa aplicação REACT usar os dados enviados pela nossa API
    # Não originam erros CORS da nossa API pois foi instalado um modulo para lidar com estes casos

    #esta função é bastante util pois permite-nos devolver para a nossa aplicação qualquer request feito a qualquer website que despolete esses erros CORS
    # tem a desvantagem de ter um tempo de resposta maior devido ao pedido React -> Nossa API -> Api -> Nossa API - > React
    # ao inves de React -> API -> React

    scraper = cloudscraper.CloudScraper()
    
    object = scraper.get(link).text
    print(object)

    return object

def remove_white_space(string):
    # alguns elementos HTML estavam a devolver demasiados espaços em branco o que adicionava caracteres vazios em demasia antes e depois do texto
    # fez-se entao esta função para se encontrar o sitio onde a frase em si começa e onde acaba
    # e devolver uma string sem o espaço branco excessivo

    firstFoud = False
    count = 0
    begin = 0
    end = 0
    for char in string:
        if (not firstFoud) and (ord(char) != 10 and ord(char) != 11 and ord(char) != 12 and ord(char) != 13 and ord(char) != 32):
            firstFoud = True
            begin = count
        elif firstFoud and (ord(char) != 10 and ord(char) != 11 and ord(char) != 12 and ord(char) != 13 and ord(char) != 32):
            end = count
        count += 1
    export_string = string[begin:end+1]
    return export_string

def getTitle(soup):
    story_head = soup.find('h1', {'class': 'headline story__headline'})
    text_with_blank = story_head.text
    text_without_blank = remove_white_space(text_with_blank)
    return text_without_blank

def getDescritpion(soup):
    story_desc = soup.find('div', {'class': 'story__blurb lead'})
    if story_desc == None:
        return []

    content_array = story_desc.findAll()

    array_to_export = []
    for elem in content_array:
        array_to_export.append({'type': elem.name, 'content': elem.text})

    return array_to_export

def getMainPic(soup):
    story_pic = soup.find('div', {'class': 'flex-media camera'})
    if story_pic == None:
        return "no image"
    img_tag = story_pic.find('img')
    return img_tag.get('data-media-viewer')

def getAllFieldsObservador(news_id):
    #esta função serve para receber o conteudo html de uma pagina e criar um objeto com 4 propriedades:
    # corpo do da noticia, titulo da noticia, descrição e imagem

    publication_url = 'https://observador.pt/?p=' + str(news_id)

    # é usado este scraper para ultrapassar bloqueios criados pelo cloudfare contra o uso de bots e outras ferramentas que incapacitavam a execução correta da função sem o uso do mesmo
    scraper = cloudscraper.CloudScraper()
    html = scraper.get(publication_url).text
    soup = bs4.BeautifulSoup(html, 'html.parser')

    #print(soup)

    title = getTitleObs(soup)
    body = getNewsBodyObs(soup, news_id)
    desc = getDescObs(soup)
    img = getImgObs(soup)

    json_to_send = {'content': body, 'title': title, 'desc': desc, 'img': img}
    print(json_to_send)
    return json_to_send

def getTitleObs(soup):
    story_title = soup.find('h1', {'class': 'article-head-content-headline-title'})
    title = remove_white_space(story_title.text)
    return title

def getNewsBodyObs(soup, id):
    #primeiramente encontra-se o div que tem a class 'article-body-content'
    story_body = soup.find('div', {'class': 'article-body-content'})
    if story_body == None:
        id_div = soup.find('div', {'data-id': id})
        if id_div.has_attr('data-src'):
            return [{'type': 'audio', 'content': id_div['data-src']}]
        elif id_div.has_attr('id') and id_div['id'] == "video-player":
            iframe = id_div.find('iframe')
            id = iframe['id']
            iframe_to_return = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            return [{'type': 'video', 'content': iframe_to_return}]

    # atribui-se este valor à variavel new_string para que esta tenha um elemento encapsulador
    new_string = "<div>"

    # para cada elemento/tag html filho direto do story_body irá ser feita uma verificação
    for elem in story_body.findChildren(recursive=False):
        #se o 'obs-ad-container' ou o 'show-if-premium' forem uma das classes do elemento/tag html ou
        # se o id for 'recirculation-optimize-test'
        # nada acontece, se estas condições nao se verificarem o elemento é adicionado á string

        if elem.has_attr('class'):
            if 'obs-ad-container' in elem['class'] or 'show-if-premium' in elem['class']:
                continue
        if elem.has_attr('id'):
            if elem['id'] == 'recirculation-optimize-test':
                break
        new_string = new_string + str(elem)
    new_string = new_string + '</div>'
    new_soup = bs4.BeautifulSoup(new_string, 'html.parser')

    for match in new_soup.findAll(['a', 'iframe', 'strong']):
        #substitui todos os elementos descritos em cima pelo seu conteudo ex:
        # <div> Ola o meu nome é <a>Jõao</a></div>
        # passaria a ser
        #<div> Ola o meu nome é Jõao</div>
        match.replaceWithChildren()

    for match in new_soup.findAll(['br', 'em']):
        # neste caso remove completamente os elementos/tags selecionados
        match.extract()

    content_array = new_soup.findAll(['p', 'h1', 'h2'])

    array_to_export = []
    for elem in content_array:
        if elem.name == 'h2' or elem.name == 'h1':
            array_to_export.append({'type': elem.name, 'content': remove_white_space(elem.text)})
        else:
            array_to_export.append({'type': elem.name, 'content': elem.text})


    return array_to_export

def getDescObs(soup):
    story_desc = soup.find('p', {'class': 'article-head-content-headline-lead'})
    if story_desc == None:
        return []
    array_to_export = []
    for elem in story_desc:
        array_to_export.append({'type': 'h2', 'content': elem.text})
    return array_to_export

def splitStringToArray(string):
    #esta função recebe uma string de links e devolve um array de links

    link_array = []
    new_string = ''
    in_link = True
    for char in string:
        if char != " " and in_link == True:
            new_string = new_string + char
        elif char == " ":
            in_link = False
            link_array.append(new_string)
            new_string = ''
        elif char == 'h' and in_link == False:
            in_link = True
            new_string = new_string + char
    return link_array


def getImgObs(soup):
    story_pic = soup.find('figure', {'class': 'article-head-image'})
    if story_pic == None:
        return 'no image'
    img_tag = story_pic.find('source')
    string = img_tag.get('srcset')
    link_array = splitStringToArray(string)
    last_pic = link_array[len(link_array)-1]
    print(last_pic)
    return last_pic


#getAllFields(1996068)

#getAllFields(1996692)

#getAllFieldsObservador(5151249)

#audio example
#getAllFieldsObservador(5154002)

#video example
#getAllFieldsObservador(5150645)

#new error
#getAllFieldsObservador(5156405)
