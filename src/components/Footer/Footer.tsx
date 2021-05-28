import {memo} from 'react'
import './footer.scss'
import sample from 'lodash/sample'
import {verbs} from '../../data'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGithub} from '@fortawesome/free-brands-svg-icons'

const Footer = (): JSX.Element => {
  return (
    <span className="footer">
      {sample(verbs)} by Juuso at
      <a href="https://nitor.com/" target="_blank" rel="noreferrer">
        Nitor
      </a>
      {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
      <div className="divider">//</div>
      <a
        href="https://github.com/NitorCreations/transition-designer"
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} size="lg" />
      </a>
    </span>
  )
}

export default memo(Footer)
