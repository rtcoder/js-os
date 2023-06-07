function getIconBaseOnType(type) {
    return {
        [fileTypes.DIR]: 'fa-sharp fa-solid fa-folder',
        [fileTypes.FILE]: 'fa-sharp fa-solid fa-file',
        [fileTypes.TEXT]: 'fa-sharp fa-solid fa-file-lines',
        [fileTypes.PDF]: 'fa-sharp fa-solid fa-file-pdf',
        [fileTypes.CSV]: 'fa-sharp fa-solid fa-file-csv',
        [fileTypes.IMAGE]: 'fa-sharp fa-solid fa-file-image',
    }[type] || 'fa-sharp fa-solid fa-file';
}

function getFullFile(tree, path, name) {
    const [dir, ...rest] = path;
    if (!dir) {
        return;
    }
    const foundDir = tree.find(obj => obj.name === dir && obj.type === fileTypes.DIR);
    if (!foundDir) {
        return;
    }
    return !rest.length
        ? (foundDir.tree || []).find(file => file.name === name)
        : getFullFile(foundDir.tree || [], rest, name);
}

function getFullFileByPath(tree, path) {
    path = path.split('/');
    const name = path[path.length - 1];
    path.length = path.length - 1;
    console.log({path,name})
    return getFullFile(tree, path, name);
}

function searchFiles(search) {
    const files = [];

    const walkAndSearch = (arr, path = '') => {
        arr.forEach(file => {
            if (file.name.toLowerCase().includes(search.toLowerCase())) {
                const f = {
                    ...file,
                    path: path + file.name
                }
                files.push(f);
            }
            walkAndSearch(file.tree || [], file.name + '/');
        })
    }

    walkAndSearch(userSettings.dirTree);

    return files;
}
